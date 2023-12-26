// TODO: Create a loading component that is pretty
const Loader = () => (
     <div className="loader">
          <div
               className="spinner-border text-primary"
               style={{ width: '3rem', height: '3rem' }}
               role="status"
          >
               <span className="sr-only">Loading...</span>
          </div>
     </div>
);

export default Loader;
