import { EntityManager } from 'typeorm';

export abstract class TestIntegrationHelper {
  constructor(protected readonly entityManager: EntityManager) {}
  abstract seed(params?: any): Promise<void>;
  abstract cleanSeed(): Promise<void>;
  abstract getFakeData(params?: any): any;
}
