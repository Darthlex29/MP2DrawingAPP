import "./Styles/App.css"
import Mensajero from "./Components/Mensajero";
/* import Canvas from "./Components/Canvas"; */
import Paint from "./Components/Paint";


function App() {

  return (
    <div className="App">
      <Mensajero/>
      {/* <Canvas
      width={700}
      height={500}/> */}
      <Paint
      width={700}
      height={500}/>
      
    </div>
  );
}

export default App;
