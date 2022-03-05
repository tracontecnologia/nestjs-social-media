import { getConnection } from 'typeorm';

export class ConnectionHelper {
  getCon() {
    return getConnection();
  }

  getEntityManager() {
    const con = this.getCon();
    return con.createEntityManager();
  }

  async closeCon() {
    const con = this.getCon();
    await con.close();
  }
}
