import './assets/css/reset.css'
import hot from './hot'

hot();
/* webpack hot reload */
if (module.hot) {
    module.hot.accept();
}
