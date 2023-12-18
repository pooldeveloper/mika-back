import { createPool } from "mysql2/promise";

export const pool = createPool({
    host:'roundhouse.proxy.rlwy.net',
    user:'root',
    password:'Bg3CgD34dCd2E2egEbee3d4Ca1a-BDBG',
    port:56758,
    database:'mika_db'
})
