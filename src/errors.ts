import { BaseError } from 'squid-utils';

export class ActionFoundError extends BaseError {
  constructor (inputName: string, action: string) {
    super('ACTION_FOUND',
      `Rule for action ${action} on input ${inputName} already added. Please use update method to update.`);
  }
}

export class ActionNotFoundError extends BaseError {
  constructor (inputName: string, action: string) {
    super('ACTION_NOT_FOUND',
      `Action ${action} on input ${inputName} not found to update. Please use add method for new entry.`);
  }
}

export class InputNotFoundError extends BaseError {
  constructor (inputName: string) {
    super('INPUT_NOT_FOUND',
      `Input ${inputName} not found to update. Please use add method for new entry.`);
  }
}
