import services from './service/service';
import filters from './filter/filter';
import directives from './directive/directive';
import components from './components/components';

export default app => INCLUDE_ALL_MODULES([services, filters, directives, components], app);