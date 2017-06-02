import menuService from './menuService';
import ReposService from './reposService';
import userService from './userService';
import apiService from './apiService';

export default app => {
    INCLUDE_ALL_MODULES([menuService,ReposService,userService, apiService], app);
}