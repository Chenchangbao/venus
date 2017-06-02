import overview from './overview/overview';
import headerCD from './headerCD/headerCD';
import version from './version/version';
import versioManage from './versioManage/versioManage';
import versioDetail from './versioDetail/versioDetail';
import versionReport from './versionReport/versionReport';
export default app => {
    INCLUDE_ALL_MODULES([overview,headerCD,version,versioManage,versioDetail,versionReport], app)
};