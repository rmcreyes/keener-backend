import { Sequelize, DataTypes, Model, BuildOptions } from "sequelize";
import DatabaseFacade from "./facade";
import { DbLookupError, DbConnectionError, DbInternalError } from "./errors";
import User from "../models/user";
import StudyGroup from "../models/group";
import Flashcard from "../models/flashcard";
import Deck from "../models/deck";

// TypeScript has trouble generating a Model definition with sequelize.define,
// so we need to define some types to help out with that
interface SequelizeUserModel extends Model {
  readonly id: number;
  username: string;
}

type StaticSequelizeUserModel = typeof Model & {
  new (values?: object, options?: BuildOptions): SequelizeUserModel;
};

interface SequelizeStudyGroupModel extends Model {
  readonly id: number;
  groupName: string;
}

type StaticSequelizeStudyGroupModel = typeof Model & {
  new (values?: object, options?: BuildOptions): SequelizeStudyGroupModel;
};

interface SequelizeFlashcardModel extends Model {
  readonly id: number;
  question: string;
  answer: string;
  creatorId: number;
  deckId: number;
}

type StaticSequelizeFlashcardModel = typeof Model & {
  new (values?: object, options?: BuildOptions): SequelizeFlashcardModel;
};

interface SequelizeDeckModel extends Model {
  readonly id: number;
  deckName: string;
  creatorId: number;
  groupId: number;
}

type StaticSequelizeDeckModel = typeof Model & {
  new (values?: object, options?: BuildOptions): SequelizeDeckModel;
};

/**
 * MySQL implementation of a database facade.
 */
export default class MySqlFacade extends DatabaseFacade {
  private sequelize: Sequelize;
  private sequelizeUserModel: StaticSequelizeUserModel;
  private sequelizeStudyGroupModel: StaticSequelizeStudyGroupModel;
  private sequelizeFlashcardModel: StaticSequelizeFlashcardModel;
  private sequelizeDeckModel: StaticSequelizeDeckModel;

  /**
   * Constructor of the MySQL facade.
   *
   * @param databaseName name of the MySQL database to use
   * @param username username used to authenticate against the database
   * @param password password used to authenticate against the database
   * @param hostName host of the MySQL database
   */
  constructor(
    databaseName: string,
    username: string,
    password: string,
    host: string
  ) {
    super();

    this.sequelize = new Sequelize(databaseName, username, password, {
      host: host,
      dialect: "mysql",
    });

    // TODO: establish relationships between models

    // define our user model for sequelize
    this.sequelizeUserModel = this.sequelize.define("User", {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
    }) as StaticSequelizeUserModel;
    // define our study group model for sequelize
    this.sequelizeStudyGroupModel = this.sequelize.define("StudyGroup", {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
      },
      groupName: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
    }) as StaticSequelizeStudyGroupModel;
    // define our flashcard model for sequelize
    this.sequelizeFlashcardModel = this.sequelize.define("Flashcard", {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
      },
      question: {
        type: new DataTypes.STRING(512),
        allowNull: false,
      },
      answer: {
        type: new DataTypes.STRING(512),
        allowNull: false,
      },
      creatorId: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
      deckId: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
    }) as StaticSequelizeFlashcardModel;
    // define our deck model for sequelize
    this.sequelizeDeckModel = this.sequelize.define("Deck", {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
      },
      deckName: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      creatorId: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
      groupId: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
    }) as StaticSequelizeDeckModel;
  }

  /**
   * Confirms authentication with the database and sets up the required tables.
   *
   * @returns a promise that resolves if we are able to successfully authenticate
              and synchronize with the database
   * @throws DbConnectionError if something goes wrong when connecting to
   *         or synchronizing with the database
   */
  public setUp(): Promise<void> {
    return new Promise((resolve, reject) => {
      let msg: string;
      this.sequelize
        .authenticate()
        // if we successfully authenticated with the database, set up our tables
        .then(() => {
          // if the database's name follows the format ".*_test",
          // drops any previously created tables
          // TODO: look into using migration and the Sequelize CLI in production
          this.sequelize
            .sync({ force: true, match: /_test$/ })
            .then(() => resolve())
            .catch((err) => {
              msg = `Model synchronization failed: ${err}`;
              reject(new DbConnectionError(msg));
            });
        })
        .catch((err) => {
          msg = `Failed to connect to MySQL database - ${err}`;
          reject(new DbConnectionError(msg));
        });
    });
  }

  /**
   * Gets a user from the database.
   *
   * @param id ID of the user to get
   * @returns promise that resolves with the desired user if found
   * @throws DbLookupError if the user could not be found
   * @throws DbInternalError if the database operation fails
   */
  public getUser(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      let msg: string;
      this.sequelizeUserModel
        .findByPk(id)
        .then((mySqlUser) => {
          if (mySqlUser === null) {
            msg = `Could not find user with ID ${id}`;
            reject(new DbLookupError(msg));
          } else {
            const user = new User(mySqlUser.id, mySqlUser.username);
            resolve(user);
          }
        })
        .catch((err) => {
          msg = `Failed to get user with ID ${id} - ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }

  /**
   * Adds a user to the database.
   *
   * @param username username of the user to create
   * @returns promise that resolves with the newly created user if the creation was successful
   * @throws DbInternalError if the database operation fails
   */
  public createUser(username: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.sequelizeUserModel
        .create({ username: username })
        .then((mySqlNewUser) => {
          const newUser = new User(mySqlNewUser.id, mySqlNewUser.username);
          resolve(newUser);
        })
        .catch((err) => {
          const msg = `Failed to create user - ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }

  /**
   * Deletes a user from the database.
   *
   * @param id ID of the user to delete
   * @returns promise that resolves if the user was deleted
   * @throws DbLookupError if the user to delete could not be found
   * @throws DbInternalError if the delete operation fails
   */
  public deleteUser(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let msg: string;
      this.sequelizeUserModel
        .findByPk(id)
        .then((mySqlUser) => {
          if (mySqlUser === null) {
            msg = `Could not find user with ID ${id}`;
            reject(new DbLookupError(msg));
          } else {
            mySqlUser
              .destroy()
              .then(() => {
                resolve();
              })
              .catch((err) => {
                msg = `Failed to delete user with ID ${id} - ${err}`;
                reject(new DbInternalError(msg));
              });
          }
        })
        .catch((err) => {
          msg = `Failed to delete user with ID ${id} - ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }

  /**
   * Updates a user in the database.
   *
   * @param user user to update with the updated fields
   * @returns promise that resolves with the updated user if the update was successful
   * @throws DbLookupError if the user to update could not be found
   * @throws DbInternalError if the update operation fails
   */
  public updateUser(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      let msg: string;
      this.sequelizeUserModel
        .findByPk(user.id)
        .then((mySqlUser) => {
          if (mySqlUser === null) {
            msg = `Could not find user with ID ${user.id}`;
            reject(new DbLookupError(msg));
          } else {
            mySqlUser.username = user.username;

            mySqlUser
              .save()
              .then(() => {
                const user = new User(mySqlUser.id, mySqlUser.username);
                resolve(user);
              })
              .catch((err) => {
                msg = `Failed to update user with ID ${mySqlUser.id} - ${err}`;
                reject(new DbInternalError(msg));
              });
          }
        })
        .catch((err) => {
          msg = `Failed to get user with ID ${user.id} - ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }

  /**
   * Gets a study group from the database.
   *
   * @param id ID of the study group to get
   * @returns promise that resolves with the desired study group if found
   * @throws DbLookupError if the study group could not be found
   * @throws DbInternalError if the database operation fails
   */
  public getStudyGroup(id: number): Promise<StudyGroup> {
    let msg: string;
    return new Promise((resolve, reject) => {
      this.sequelizeStudyGroupModel
        .findByPk(id)
        .then((mySqlStudyGroup) => {
          if (mySqlStudyGroup == null) {
            msg = `Could not find study group with ID ${id}`;
            reject(new DbLookupError(msg));
          } else {
            const studyGroup = new StudyGroup(
              mySqlStudyGroup.id,
              mySqlStudyGroup.groupName
            );
            resolve(studyGroup);
          }
        })
        .catch((err) => {
          msg = `Failed to get study group with ID ${id} - ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }

  /**
   * Adds a study group to the database.
   *
   * @param groupName group name of the study group to create
   * @returns promise that resolves with the newly created study group if the creation was successful
   * @throws DbInternalError if the database operation fails
   */
  public createStudyGroup(groupName: string): Promise<StudyGroup> {
    return new Promise((resolve, reject) => {
      this.sequelizeStudyGroupModel
        .create({ groupName: groupName })
        .then((mySqlNewStudyGroup) => {
          const newStudyGroup = new StudyGroup(
            mySqlNewStudyGroup.id,
            mySqlNewStudyGroup.groupName
          );
          resolve(newStudyGroup);
        })
        .catch((err) => {
          const msg = `Failed to create study group: ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }

  /**
   * Delete a study group from the database.
   *
   * @param id ID of the study group to delete
   * @returns promise that resolves if the study group was deleted
   * @throws DbLookupError if the study group to delete could not be found
   * @throws DbInternalError if the delete operation fails
   */
  public deleteStudyGroup(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let msg: string;
      this.sequelizeStudyGroupModel
        .findByPk(id)
        .then((mySqlStudyGroup) => {
          if (mySqlStudyGroup === null) {
            msg = `Could not find study group with ID ${id}`;
            reject(new DbLookupError(msg));
          } else {
            mySqlStudyGroup
              .destroy()
              .then(() => {
                resolve();
              })
              .catch((err) => {
                msg = `Failed to delete study group with ID ${id} - ${err}`;
                reject(new DbInternalError(msg));
              });
          }
        })
        .catch((err) => {
          msg = `Failed to delete study group with ID ${id} - ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }

  /**
   * Update a study group in the database.
   *
   * @param studyGroup study group to update with the updated fields
   * @returns promise that resolves with the updated study group if the update was successful
   * @throws DbLookupError if the user to update could not be found
   * @throws DbInternalError if the update operation fails
   */
  public updateStudyGroup(studyGroup: StudyGroup): Promise<StudyGroup> {
    return new Promise((resolve, reject) => {
      let msg: string;
      this.sequelizeStudyGroupModel
        .findByPk(studyGroup.id)
        .then((mySqlStudyGroup) => {
          if (mySqlStudyGroup === null) {
            msg = `Could not find study group with ID ${studyGroup.id}`;
            reject(new DbLookupError(msg));
          } else {
            mySqlStudyGroup.groupName = studyGroup.groupName;

            mySqlStudyGroup
              .save()
              .then(() => {
                const studyGroup = new StudyGroup(
                  mySqlStudyGroup.id,
                  mySqlStudyGroup.groupName
                );
                resolve(studyGroup);
              })
              .catch((err) => {
                msg = `Failed to update study group with ID ${mySqlStudyGroup.id} - ${err}`;
                reject(new DbInternalError(msg));
              });
          }
        })
        .catch((err) => {
          msg = `Failed to get study group with ID ${studyGroup.id} - ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }

  /**
   * Gets a flashcard from the database.
   *
   * @param id ID of the flashcard to get
   * @returns promise that resolves with the desired flashcard if found
   * @throws DbLookupError if the flashcard could not be found
   * @throws DbInternalError if the database operation fails
   */
  public getFlashcard(id: number): Promise<Flashcard> {
    return new Promise((resolve, reject) => {
      let msg: string;
      this.sequelizeFlashcardModel
        .findByPk(id)
        .then((mySqlFlashcard) => {
          if (mySqlFlashcard === null) {
            msg = `Could not find flashcard with ID ${id}`;
            reject(new DbLookupError(msg));
          } else {
            const flashcard = new Flashcard(
              mySqlFlashcard.id,
              mySqlFlashcard.question,
              mySqlFlashcard.answer,
              mySqlFlashcard.creatorId,
              mySqlFlashcard.deckId
            );
            resolve(flashcard);
          }
        })
        .catch((err) => {
          msg = `Failed to get flashcard with ID ${id} - ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }

  /**
   * Adds a flashcard to the database.
   *
   * @param question question of the flashcard to create
   * @param answer answer of the flashcard to create
   * @param creatorId ID of the user who created this flashcard
   * @param deckId ID of the deck this flashcard belongs to
   * @returns promise that reoslves with the newly created flashcard if the creation was successful
   * @throws DbInternalError if the database operation fails
   */
  public createFlashcard(
    question: string,
    answer: string,
    creatorId: number,
    deckId: number
  ): Promise<Flashcard> {
    return new Promise((resolve, reject) => {
      this.sequelizeFlashcardModel
        .create({
          question: question,
          answer: answer,
          creatorId: creatorId,
          deckId: deckId,
        })
        .then((mySqlNewFlashcard) => {
          const newFlashcard = new Flashcard(
            mySqlNewFlashcard.id,
            mySqlNewFlashcard.question,
            mySqlNewFlashcard.answer,
            mySqlNewFlashcard.creatorId,
            mySqlNewFlashcard.deckId
          );
          resolve(newFlashcard);
        })
        .catch((err) => {
          const msg = `Failed to create flashcard - ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }

  /**
   * Delete a flashcard from the database.
   *
   * @param id ID of the flashcard to delete
   * @returns promise that resolves if the flashcard was deleted
   * @throws DbLookupError if the flashcard to delete could not be found
   * @throws DbInternalError if the delete operation fails
   */
  public deleteFlashcard(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let msg: string;
      this.sequelizeFlashcardModel
        .findByPk(id)
        .then((mySqlFlashcard) => {
          if (mySqlFlashcard === null) {
            msg = `Could not find flashcard with ID ${id}`;
            reject(new DbLookupError(msg));
          } else {
            mySqlFlashcard
              .destroy()
              .then(() => {
                resolve();
              })
              .catch((err) => {
                msg = `Failed to delete flashcard with ID ${id} - ${err}`;
                reject(new DbInternalError(msg));
              });
          }
        })
        .catch((err) => {
          msg = `Failed to get flashcard with ID ${id} - ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }

  /**
   * Update a flashcard in the database.
   *
   * @param flashcard flashcard to update with the updated fields
   * @returns promise that resolves with the updated flashcard if the update was successful
   * @throws DbLookupError if the flashcard to update could not be found
   * @throws DbInternalError if the update operation fails
   */
  public updateFlashcard(flashcard: Flashcard): Promise<Flashcard> {
    return new Promise((resolve, reject) => {
      let msg: string;
      this.sequelizeFlashcardModel
        .findByPk(flashcard.id)
        .then((mySqlFlashcard) => {
          if (mySqlFlashcard === null) {
            msg = `Could not find flashcard with ID ${flashcard.id}`;
            reject(new DbLookupError(msg));
          } else {
            mySqlFlashcard.question = flashcard.question;
            mySqlFlashcard.answer = flashcard.answer;
            mySqlFlashcard.creatorId = flashcard.creatorId;
            mySqlFlashcard.deckId = flashcard.deckId;

            mySqlFlashcard
              .save()
              .then(() => {
                const flashcard = new Flashcard(
                  mySqlFlashcard.id,
                  mySqlFlashcard.question,
                  mySqlFlashcard.answer,
                  mySqlFlashcard.creatorId,
                  mySqlFlashcard.deckId
                );
                resolve(flashcard);
              })
              .catch((err) => {
                msg = `Failed to update flashcard with ID ${flashcard.id} - ${err}`;
                reject(new DbInternalError(msg));
              });
          }
        })
        .catch((err) => {
          msg = `Failed to get flashcard with ID ${flashcard.id} - ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }

  /**
   * Gets a deck from the database.
   *
   * @param id ID of the deck to get
   * @returns promise that resolves with the desired deck if found
   * @throws DbLookupError if the deck could not be found
   * @throws DbInternalError if the database operation fails
   */
  public getDeck(id: number): Promise<Deck> {
    return new Promise((resolve, reject) => {
      let msg: string;
      this.sequelizeDeckModel
        .findByPk(id)
        .then((mySqlDeck) => {
          if (mySqlDeck === null) {
            msg = `Could not find deck with ID ${id}`;
            reject(new DbLookupError(msg));
          } else {
            const deck = new Deck(
              mySqlDeck.id,
              mySqlDeck.deckName,
              mySqlDeck.creatorId,
              mySqlDeck.groupId
            );
            resolve(deck);
          }
        })
        .catch((err) => {
          msg = `Failed to get deck with ID ${id} - ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }

  /**
   * Adds a deck to the database.
   *
   * @param deckName name of the deck to create
   * @param creatorId ID of the user who created this deck
   * @param groupId ID of the group this deck belongs to
   * @returns promise that resolves with the newly created deck if the creation was successful
   * @throws DbInternalError if the database operation fails
   */
  public createDeck(
    deckName: string,
    creatorId: number,
    groupId: number
  ): Promise<Deck> {
    return new Promise((resolve, reject) => {
      this.sequelizeDeckModel
        .create({
          deckName: deckName,
          creatorId: creatorId,
          groupId: groupId,
        })
        .then((mySqlNewDeck) => {
          const newDeck = new Deck(
            mySqlNewDeck.id,
            mySqlNewDeck.deckName,
            mySqlNewDeck.creatorId,
            mySqlNewDeck.groupId
          );
          resolve(newDeck);
        })
        .catch((err) => {
          const msg = `Failed to create deck - ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }

  /**
   * Delete a deck from the database.
   *
   * @param id ID of the deck to delete
   * @returns promise that resolves if the deck was deleted
   * @throws DbLookupError if the deck to delete could not be found
   * @throws DbInternalError if the delete operation fails
   */
  public deleteDeck(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let msg: string;
      this.sequelizeDeckModel
        .findByPk(id)
        .then((myDeck) => {
          if (myDeck === null) {
            msg = `Could not find deck with ID ${id}`;
            reject(new DbLookupError(msg));
          } else {
            myDeck
              .destroy()
              .then(() => {
                resolve();
              })
              .catch((err) => {
                msg = `Failed to delete deck with ID ${id} - ${err}`;
                reject(new DbInternalError(msg));
              });
          }
        })
        .catch((err) => {
          msg = `Failed to get deck with ID ${id} - ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }

  /**
   * Update a deck in our database.
   *
   * @param deck deck to update with the updated fields
   * @returns promise that resolves with the updated deck if the update was successful
   * @throws DbLookupError if the deck to update could not be found
   * @throws DbInternalError if the update operation fails
   */
  public updateDeck(deck: Deck): Promise<Deck> {
    return new Promise((resolve, reject) => {
      let msg: string;
      this.sequelizeDeckModel
        .findByPk(deck.id)
        .then((mySqlDeck) => {
          if (mySqlDeck === null) {
            msg = `Could not find deck with ID ${deck.id}`;
            reject(new DbLookupError(msg));
          } else {
            mySqlDeck.deckName = deck.deckName;
            mySqlDeck.creatorId = deck.creatorId;
            mySqlDeck.groupId = deck.groupId;

            mySqlDeck
              .save()
              .then(() => {
                const deck = new Deck(
                  mySqlDeck.id,
                  mySqlDeck.deckName,
                  mySqlDeck.creatorId,
                  mySqlDeck.groupId
                );
                resolve(deck);
              })
              .catch((err) => {
                msg = `Failed to update deck with ID ${deck.id} - ${err}`;
                reject(new DbInternalError(msg));
              });
          }
        })
        .catch((err) => {
          msg = `Failed to get deck with ID ${deck.id} - ${err}`;
          reject(new DbInternalError(msg));
        });
    });
  }
}
