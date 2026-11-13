import '../styles/header.css'

export default function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Cine Aurora, inicio">
        <span className="brand-mark" aria-hidden="true">A</span>
        <span className="brand-name">CINE <strong>AURORA</strong></span>
      </a>
      <nav className="main-nav" aria-label="Navegación principal">
        <a className="nav-link is-active" href="#peliculas">Cartelera</a>
        <a className="nav-link" href="#proximamente">Próximamente</a>
        <a className="nav-link" href="#experiencia">La experiencia</a>
      </nav>
      <a className="header-cta" href="#cartelera">Ver películas <span aria-hidden="true">↗</span></a>
    </header>
  )
}
