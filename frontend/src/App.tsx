import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Blogs } from './pages/Blogs';
import { BlogDetail } from './pages/BlogDetail';
import { About } from './pages/About';
import { CreateBlog } from './pages/CreateBlog';
import { BlogProvider } from './context/BlogContext';
import './App.css';

function App() {
  return (
    <BlogProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/create" element={<CreateBlog />} />
            </Routes>
          </main>
        </div>
      </Router>
    </BlogProvider>
  );
}

export default App; 