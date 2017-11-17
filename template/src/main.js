import hot from './hot'

hot();
/* webpack hot reload */
if (module.hot) {
    module.hot.accept();
}
