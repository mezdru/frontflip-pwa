import Store from "./store";
import { observable, action, decorate } from "mobx";
import orgStore from './organisation.store';

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

  async fetchSkillsProposition(spId) {
    this.skillsProposition = await super.fetchResource(spId);
    return this.skillsProposition;
  }

  async updateSkillsPropositionStatus(spId, status) {
    let spUpdated = await super.updateResource(spId, {status: status}, orgStore.currentOrganisation._id);
    this.skillsProposition = spUpdated;
    return this.skillsProposition;
  }}

decorate(SkillsPropositionStore, {
  postSkillsProposition: action,
  fetchSkillsProposition: action,
  skillsProposition: observable
});

export default new SkillsPropositionStore();
