export abstract class Commitable {
  abstract async commit(): Promise<void>
}