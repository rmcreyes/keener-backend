import DatabaseFacade from "db/facade";
import ApiResponse from "apis/response";
import { ApiUnknownError } from "apis/errors";
import { DbLookupError, DbInternalError } from "db/errors";

/**
 * Object to handle API logic.
 */
export default class ApiHandler {
  private dbFacade: DatabaseFacade;

  /**
   * Constructor for the API handler.
   *
   * @param dbFacade database facade to access the database with
   */
  constructor(dbFacade: DatabaseFacade) {
    this.dbFacade = dbFacade;
  }

  /**
   * API to get a user's info via their ID.
   *
   * @param id ID of the user whose info is to be retrieved
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public getUser(id: number): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.dbFacade
        .getUser(id)
        .then((user) => {
          const res = {
            response: user.serialize(),
            code: 200,
          };
          resolve(res);
        })
        .catch((err) => {
          if (err instanceof DbLookupError) {
            const res = {
              response: err.message,
              code: 404,
            };
            resolve(res);
          } else if (err instanceof DbInternalError) {
            const res = {
              response: err.message,
              code: 500,
            };
            resolve(res);
          } else {
            reject(
              new ApiUnknownError(
                `Unhandled error raised when getting user from database - ${err}`
              )
            );
          }
        });
    });
  }

  /**
   * API to create a user.
   *
   * @param username username of the user to create
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public createUser(username: string): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.dbFacade
        .createUser(username)
        .then((user) => {
          const res = {
            response: user.serialize(),
            code: 201,
          };
          resolve(res);
        })
        .catch((err) => {
          if (err instanceof DbInternalError) {
            const res = {
              response: err.message,
              code: 500,
            };
            resolve(res);
          } else {
            reject(
              new ApiUnknownError(
                `Unhandled error raised when creating user - ${err}`
              )
            );
          }
        });
    });
  }

  /**
   * API to delete a user via their ID.
   *
   * @param id ID of the user to delete
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public deleteUser(id: number): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.dbFacade
        .deleteUser(id)
        .then(() => {
          const res = {
            response: `User with ID ${id} successfully deleted`,
            code: 200,
          };
          resolve(res);
        })
        .catch((err) => {
          if (err instanceof DbLookupError) {
            const res = {
              response: err.message,
              code: 404,
            };
            resolve(res);
          } else if (err instanceof DbInternalError) {
            const res = {
              response: err.message,
              code: 500,
            };
            resolve(res);
          } else {
            reject(
              new ApiUnknownError(
                `Unhandled error raised when deleting user - ${err}`
              )
            );
          }
        });
    });
  }

  /**
   * API for updating a user's info.
   *
   * @param id ID of the user to update
   * @param username requested username to update to for the user
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public updateUser(id: number, username?: string): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      if (username === undefined) {
        const res = {
          response:
            "No fields have been requested to be updated. Please specify fields to update",
          code: 400,
        };
        resolve(res);
      } else {
        this.dbFacade
          .getUser(id)
          .then((user) => {
            user.username = username;
            this.dbFacade
              .updateUser(user)
              .then((user) => {
                const res = {
                  response: user.serialize(),
                  code: 200,
                };
                resolve(res);
              })
              .catch((err) => {
                if (err instanceof DbLookupError) {
                  const res = {
                    response: `User deleted before update could be completed - ${err.message}`,
                    code: 409,
                  };
                  resolve(res);
                } else if (err instanceof DbInternalError) {
                  const res = {
                    response: err.message,
                    code: 500,
                  };
                  resolve(res);
                } else {
                  reject(
                    new ApiUnknownError(
                      `Unhandled error raised when updating user - ${err}`
                    )
                  );
                }
              });
          })
          .catch((err) => {
            if (err instanceof DbLookupError) {
              const res = {
                response: err.message,
                code: 404,
              };
              resolve(res);
            } else if (err instanceof DbInternalError) {
              const res = {
                response: err.message,
                code: 500,
              };
              resolve(res);
            } else {
              reject(
                new ApiUnknownError(
                  `Unhandled error raised when updating user - ${err}`
                )
              );
            }
          });
      }
    });
  }

  /**
   * API to get a study group's info via its ID.
   *
   * @param id ID of the study group whose info is to be retrieved
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public getStudyGroup(id: number): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.dbFacade
        .getStudyGroup(id)
        .then((studyGroup) => {
          const res = {
            response: studyGroup.serialize(),
            code: 200,
          };
          resolve(res);
        })
        .catch((err) => {
          if (err instanceof DbLookupError) {
            const res = {
              response: err.message,
              code: 404,
            };
            resolve(res);
          } else if (err instanceof DbInternalError) {
            const res = {
              response: err.message,
              code: 500,
            };
            resolve(res);
          } else {
            reject(
              new ApiUnknownError(
                `Unhandled error raised when getting study group from database - ${err}`
              )
            );
          }
        });
    });
  }

  /**
   * API to create a study group.
   *
   * @param groupName name of the study group to create
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public createStudyGroup(groupName: string): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.dbFacade
        .createStudyGroup(groupName)
        .then((studyGroup) => {
          const res = {
            response: studyGroup.serialize(),
            code: 201,
          };
          resolve(res);
        })
        .catch((err) => {
          if (err instanceof DbInternalError) {
            const res = {
              response: err.message,
              code: 500,
            };
            resolve(res);
          } else {
            reject(
              new ApiUnknownError(
                `Unhandled error raised when creating study group - ${err}`
              )
            );
          }
        });
    });
  }

  /**
   * API to deelte a study group via its ID.
   *
   * @param id ID of the study group to delete
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public deleteStudyGroup(id: number): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.dbFacade
        .deleteStudyGroup(id)
        .then(() => {
          const res = {
            response: `Study group with ID ${id} successfully deleted`,
            code: 200,
          };
          resolve(res);
        })
        .catch((err) => {
          if (err instanceof DbLookupError) {
            const res = {
              response: err.message,
              code: 404,
            };
            resolve(res);
          } else if (err instanceof DbInternalError) {
            const res = {
              response: err.message,
              code: 500,
            };
            resolve(res);
          } else {
            reject(
              new ApiUnknownError(
                `Unhandled error raised when deleting study group - ${err}`
              )
            );
          }
        });
    });
  }

  /**
   * API for updating a study group's info.
   *
   * @param id ID of the study group to update
   * @param groupName requested group name to update to for the study group
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public updateStudyGroup(
    id: number,
    groupName?: string
  ): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      if (groupName === undefined) {
        const res = {
          response:
            "No fields have been requested to be updated. Please specify fields to update",
          code: 400,
        };
        resolve(res);
      } else {
        this.dbFacade
          .getStudyGroup(id)
          .then((studyGroup) => {
            studyGroup.groupName = groupName;
            this.dbFacade
              .updateStudyGroup(studyGroup)
              .then((studyGroup) => {
                const res = {
                  response: studyGroup.serialize(),
                  code: 200,
                };
                resolve(res);
              })
              .catch((err) => {
                if (err instanceof DbLookupError) {
                  const res = {
                    response: `Study group deleted before update could be completed - ${err.message}`,
                    code: 409,
                  };
                  resolve(res);
                } else if (err instanceof DbInternalError) {
                  const res = {
                    response: err.message,
                    code: 500,
                  };
                  resolve(res);
                } else {
                  reject(
                    new ApiUnknownError(
                      `Unhandled error raised when updating study group - ${err}`
                    )
                  );
                }
              });
          })
          .catch((err) => {
            if (err instanceof DbLookupError) {
              const res = {
                response: err.message,
                code: 404,
              };
              resolve(res);
            } else if (err instanceof DbInternalError) {
              const res = {
                response: err.message,
                code: 500,
              };
              resolve(res);
            } else {
              reject(
                new ApiUnknownError(
                  `Unhandled error raised when updating study group - ${err}`
                )
              );
            }
          });
      }
    });
  }

  /**
   * API to get a flashcard's info via its ID.
   *
   * @param id ID of the flashcard whose info is to be retrieved
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public getFlashcard(id: number): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.dbFacade
        .getFlashcard(id)
        .then((flashcard) => {
          const res = {
            response: flashcard.serialize(),
            code: 200,
          };
          resolve(res);
        })
        .catch((err) => {
          if (err instanceof DbLookupError) {
            const res = {
              response: err.message,
              code: 404,
            };
            resolve(res);
          } else if (err instanceof DbInternalError) {
            const res = {
              response: err.message,
              code: 500,
            };
            resolve(res);
          } else {
            reject(
              new ApiUnknownError(
                `Unhandled error raised when getting flashcard from database - ${err}`
              )
            );
          }
        });
    });
  }

  /**
   * API to create a flashcard.
   *
   * @param question question of the flashcard to create
   * @param answer answer of the flashcard to create
   * @param creatorId ID of the user who created this flashcard
   * @param deckId ID of the deck this flashcard belongs to
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public createFlashcard(
    question: string,
    answer: string,
    creatorId: number,
    deckId: number
  ): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.dbFacade
        .createFlashcard(question, answer, creatorId, deckId)
        .then((flashcard) => {
          const res = {
            response: flashcard.serialize(),
            code: 201,
          };
          resolve(res);
        })
        .catch((err) => {
          if (err instanceof DbInternalError) {
            const res = {
              response: err.message,
              code: 500,
            };
            resolve(res);
          } else {
            reject(
              new ApiUnknownError(
                `Unhandled error raised when creating flashcard - ${err}`
              )
            );
          }
        });
    });
  }

  /**
   * API to delete a flashcard via its ID.
   *
   * @param id ID of the flashcard to delete
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public deleteFlashcard(id: number): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.dbFacade
        .deleteFlashcard(id)
        .then(() => {
          const res = {
            response: `Flashcard with ID ${id} successfully deleted`,
            code: 200,
          };
          resolve(res);
        })
        .catch((err) => {
          if (err instanceof DbLookupError) {
            const res = {
              response: err.message,
              code: 404,
            };
            resolve(res);
          } else if (err instanceof DbInternalError) {
            const res = {
              response: err.message,
              code: 500,
            };
            resolve(res);
          } else {
            reject(
              new ApiUnknownError(
                `Unhandled error raised when deleting user - ${err}`
              )
            );
          }
        });
    });
  }

  /**
   * API for updating a flashcard's info.
   *
   * @param id ID of the flashcard to update
   * @param answer requested answer to update to for the flashcard
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public updateFlashcard(id: number, answer?: string): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      if (answer === undefined) {
        const res = {
          response:
            "No fields have been requested to be updated. Please specify fields to update",
          code: 400,
        };
        resolve(res);
      } else {
        this.dbFacade
          .getFlashcard(id)
          .then((flashcard) => {
            flashcard.answer = answer;
            this.dbFacade
              .updateFlashcard(flashcard)
              .then((flashcard) => {
                const res = {
                  response: flashcard.serialize(),
                  code: 200,
                };
                resolve(res);
              })
              .catch((err) => {
                if (err instanceof DbLookupError) {
                  const res = {
                    response: `Flashcard deleted before update could be completed - ${err.message}`,
                    code: 409,
                  };
                  resolve(res);
                } else if (err instanceof DbInternalError) {
                  const res = {
                    response: err.message,
                    code: 500,
                  };
                  resolve(res);
                } else {
                  reject(
                    new ApiUnknownError(
                      `Unhandled error raised when updating flashcard - ${err}`
                    )
                  );
                }
              });
          })
          .catch((err) => {
            if (err instanceof DbLookupError) {
              const res = {
                response: err.message,
                code: 404,
              };
              resolve(res);
            } else if (err instanceof DbInternalError) {
              const res = {
                response: err.message,
                code: 500,
              };
              resolve(res);
            } else {
              reject(
                new ApiUnknownError(
                  `Unhandled error raised when updating flashcard - ${err}`
                )
              );
            }
          });
      }
    });
  }

  /**
   * API to get a deck's info via its ID.
   *
   * @param id ID of the deck whose info is to be retrieved
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public getDeck(id: number): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.dbFacade
        .getDeck(id)
        .then((deck) => {
          const res = {
            response: deck.serialize(),
            code: 200,
          };
          resolve(res);
        })
        .catch((err) => {
          if (err instanceof DbLookupError) {
            const res = {
              response: err.message,
              code: 404,
            };
            resolve(res);
          } else if (err instanceof DbInternalError) {
            const res = {
              response: err.message,
              code: 500,
            };
            resolve(res);
          } else {
            reject(
              new ApiUnknownError(
                `Unhandled error raised when getting deck from database - ${err}`
              )
            );
          }
        });
    });
  }

  /**
   * API to create a deck.
   *
   * @param deckName name of the deck to create
   * @param creatorId ID of the user who created this deck
   * @param groupId ID of the group this deck belongs to
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public createDeck(
    deckName: string,
    creatorId: number,
    groupId: number
  ): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.dbFacade
        .createDeck(deckName, creatorId, groupId)
        .then((deck) => {
          const res = {
            response: deck.serialize(),
            code: 201,
          };
          resolve(res);
        })
        .catch((err) => {
          if (err instanceof DbInternalError) {
            const res = {
              response: err.message,
              code: 500,
            };
            resolve(res);
          } else {
            reject(
              new ApiUnknownError(
                `Unhandled error raised when creating deck - ${err}`
              )
            );
          }
        });
    });
  }

  /**
   * API to delete a deck via its ID.
   *
   * @param id ID of the deck to delete
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public deleteDeck(id: number): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.dbFacade
        .deleteDeck(id)
        .then(() => {
          const res = {
            response: `Deck with ID ${id} successfully deleted`,
            code: 200,
          };
          resolve(res);
        })
        .catch((err) => {
          if (err instanceof DbLookupError) {
            const res = {
              response: err.message,
              code: 404,
            };
            resolve(res);
          } else if (err instanceof DbInternalError) {
            const res = {
              response: err.message,
              code: 500,
            };
            resolve(res);
          } else {
            reject(
              new ApiUnknownError(
                `Unhandled error raised when deleting deck - ${err}`
              )
            );
          }
        });
    });
  }

  /**
   * API for updating a deck's info.
   *
   * @param id ID of the deck to update
   * @param deckName requested deck name to update to for the deck
   * @returns an ApiResponse object containing the response
   * @throws ApiUnkownError if an error is unhandled when accessing the database
   */
  public updateDeck(id: number, deckName?: string): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      if (deckName === undefined) {
        const res = {
          response:
            "No fields have been requested to be updated. Please specify fields to update",
          code: 400,
        };
        resolve(res);
      } else {
        this.dbFacade
          .getDeck(id)
          .then((deck) => {
            deck.deckName = deckName;
            this.dbFacade
              .updateDeck(deck)
              .then((deck) => {
                const res = {
                  response: deck.serialize(),
                  code: 200,
                };
                resolve(res);
              })
              .catch((err) => {
                if (err instanceof DbLookupError) {
                  const res = {
                    response: `Deck deleted before update could be completed - ${err.message}`,
                    code: 409,
                  };
                  resolve(res);
                } else if (err instanceof DbInternalError) {
                  const res = {
                    response: err.message,
                    code: 500,
                  };
                  resolve(res);
                } else {
                  reject(
                    new ApiUnknownError(
                      `Unhandled error raised when updating deck - ${err}`
                    )
                  );
                }
              });
          })
          .catch((err) => {
            if (err instanceof DbLookupError) {
              const res = {
                response: err.message,
                code: 404,
              };
              resolve(res);
            } else if (err instanceof DbInternalError) {
              const res = {
                response: err.message,
                code: 500,
              };
              resolve(res);
            } else {
              reject(
                new ApiUnknownError(
                  `Unhandled error raised when updating deck - ${err}`
                )
              );
            }
          });
      }
    });
  }
}
