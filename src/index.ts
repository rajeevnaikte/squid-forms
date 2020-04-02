import RuleEvaluator from 'squid-eval';
import { ActionFoundError, ActionNotFoundError, InputNotFoundError } from './errors';
import { getNonNull, getOrSetDefault } from 'squid-utils';
import { JsonType } from './types';

/**
 * Holder of action name and corresponding rule.
 * e.g. { action: 'hide', ruleName: Symbol() }
 */
interface ActionRule {
  action: string;
  ruleName: symbol;
}

/**
 * Rules for actions to be taken on input fields.
 * such as, hide, remove, change input type
 */
export class InputActionRules {
  private readonly inputNameActionRules = new Map<string, ActionRule[]>();
  private readonly ruleEvaluator = new RuleEvaluator();

  /**
   * Add a rule for an action on a input
   * @param inputName
   * @param actionRule
   */
  add (inputName: string, action: string, rule: string): void {
    const actionRule = {
      action,
      ruleName: Symbol()
    };
    const actionRules = getOrSetDefault(this.inputNameActionRules, inputName, []);

    if (actionRules.find(item => item.action === action)) {
      throw new ActionFoundError(inputName, action);
    }

    actionRules.push(actionRule);

    this.ruleEvaluator.parse(actionRule.ruleName, rule);
  }

  /**
   * Update rule of existing action on given input.
   * @param inputName
   * @param action
   * @param rule
   */
  update (inputName: string, action: string, rule: string): void {
    const actionRules = getNonNull(this.inputNameActionRules.get(inputName),
      () => new InputNotFoundError(inputName));
    const actionRule = getNonNull(actionRules.find(item => item.action === action),
      () => new ActionNotFoundError(inputName, action));

    this.ruleEvaluator.update(actionRule.ruleName, rule);
  }

  /**
   * Execute rules with given form-data and find actions for given input.
   */
  evaluateActions (inputName: string, formData: JsonType): string[] {
    const actionRules = this.inputNameActionRules.get(inputName);
    const actions: string[] = [];

    if (actionRules) {
      for (const actionRule of actionRules) {
        if (this.ruleEvaluator.execute(actionRule.ruleName, formData)) {
          actions.push(actionRule.action);
        }
      }
    }

    return actions;
  }
}
