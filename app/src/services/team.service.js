const logger = require('logger');
const ctRegisterMicroservice = require('ct-register-microservice-node');

class TeamService {
  static async getTeam(teamId) {
    logger.info('Get team');
    let team = null;
    try {
      team = await ctRegisterMicroservice.requestToMicroservice({
        uri: '/teams/' + teamId,
        method: 'GET',
        json: true
      });
    } catch (e) {
      throw new Error(e);
    }

    return Object.assign({}, team.data.attributes, { id: team.data.id });
  }

  static async getTeamByUserId(userId) {
    logger.info('Get team by user id');
    let team = null;
    try {
      team = await ctRegisterMicroservice.requestToMicroservice({
        uri: '/teams/user' + userId,
        method: 'GET',
        json: true
      });
    } catch (e) {
      throw new Error(e);
    }
    return Object.assign({}, team.data.attributes, { id: team.data.id });
  }
  static async patchTeamById(teamId, body) {
    logger.info('Get team by user id');
    let team = null;
    try {
      team = await ctRegisterMicroservice.requestToMicroservice({
        uri: '/teams/' + teamId,
        method: 'PATCH',
        body,
        json: true
      });
    } catch (e) {
      throw new Error(e);
    }
    return Object.assign({}, team.data.attributes, { id: team.data.id });
  }
}
module.exports = TeamService;
