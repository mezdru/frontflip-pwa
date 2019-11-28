import Store from "./store";
import { observable, action, decorate } from "mobx";


class SkillsPropositionStore extends Store {
  skillsProposition = {};

  constructor() {
    super("SkillsProposition");
  }

  async postSkillsProposition(skillsPropositionToPost) {
    let skillsProposition = await super.postResource(skillsPropositionToPost);
    this.skillsProposition = skillsProposition;
    return skillsProposition;
  }
}

decorate(SkillsPropositionStore, {
  postSkillsProposition: action,
  skillsProposition: observable
});

export default new SkillsPropositionStore();