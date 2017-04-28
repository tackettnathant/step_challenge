import { useRouterHistory } from 'react-router'
import { createHashHistory } from 'history'
const appHistory = useRouterHistory(createHashHistory)();

export default appHistory;