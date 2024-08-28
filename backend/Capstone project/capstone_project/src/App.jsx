import Quize_form from './Pages/Quize_form/quize1'
import QuizForm from './Pages/Add_Quiz/add_quiz'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import QuizTable from './Pages/Update_Quiz/update_quiz';

function App() {

  return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<QuizForm/>}/>
            <Route path="/quize1" element={<Quize_form/>}/>
            <Route path="/update" element={<QuizTable/>}/>
            
          </Routes>
        </BrowserRouter>
      </div>
  )
}

export default App
