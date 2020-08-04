import {
  createStubInstance,
  StubbableType,
  SinonStubbedInstance,
  SinonStubbedMember,
} from "sinon";

/**
 * Solution for stubbing classes with private members - constructors that require instances of
 * objects that have private members have trouble being stubbed with the default createStubInstance,
 * so these wrappers were created. Solution taken from https://github.com/sinonjs/sinon/issues/1963
 */

/**
 * Wrapper class of SinonStubbedInstance to define private members of the class to stub.
 */
export type SinonStubbedClass<T> = SinonStubbedInstance<T> & T;

/**
 * A wrapper function of sinon's createStubInstance that returns a stubbed class instance
 * where the class's private members are defined.
 *
 * @template T Type being stubbed
 * @param constructor Object or class to stub
 * @param overrides An optional map overriding created stubs
 * @returns A stubbed version of the constructor
 */
export function createSinonStubInstance<T>(
  constructor: StubbableType<T>,
  overrides?: { [K in keyof T]?: SinonStubbedMember<T[K]> }
): SinonStubbedClass<T> {
  const stub = createStubInstance<T>(constructor, overrides);
  return (stub as unknown) as SinonStubbedClass<T>;
}
