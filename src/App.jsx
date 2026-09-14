import { EditProvider } from './context/EditContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Works from './components/Works'
import Skills from './components/Skills'
import Contact from './components/Contact'
import DotNav from './components/DotNav'
import EditToolbar from './components/EditToolbar'
import CursorFX from './components/CursorFX'
import ScrollProgress from './components/ScrollProgress'

export default function App() {
  return (
    <EditProvider>
      <div className="site">
        <ScrollProgress />
        <CursorFX />
        <Navbar />
        <main>
          <section id="hero" className="page-section">
            <Hero />
          </section>
          <section id="about" className="page-section">
            <About />
          </section>
          <section id="works" className="page-section">
            <Works />
          </section>
          <section id="skills" className="page-section">
            <Skills />
          </section>
          <section id="contact" className="page-section">
            <Contact />
          </section>
        </main>
        <DotNav />
        <EditToolbar />
      </div>
    </EditProvider>
  )
}
