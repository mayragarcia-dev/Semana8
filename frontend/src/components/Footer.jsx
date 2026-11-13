import '../styles/footer.css'

export default function Footer() {
  return (
    <footer className="site-footer" id="contacto">
      <div className="site-footer__top">
        <a className="brand site-footer__brand" href="#inicio" aria-label="Cine Aurora, volver al inicio">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span className="brand-name">CINE <strong>AURORA</strong></span>
        </a>
        <p>Las historias se disfrutan mejor<br />cuando las compartimos.</p>
        <div className="site-footer__contact">
          <span>VEN A VISITARNOS</span>
          <a href="https://maps.google.com/?q=Av.+Larco+1234,+Miraflores,+Lima">Av. Larco 1234, Miraflores, Lima</a>
          <a href="tel:+5115550123">+51 1 555 0123</a>
          <a href="mailto:hola@cineaurora.pe">hola@cineaurora.pe</a>
        </div>
        <div className="site-footer__hours">
          <span>HORARIOS DE ATENCIÓN</span>
          <p>Lun — Dom<br />12:00 p. m. — 11:00 p. m.</p>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Cine Aurora. Todos los derechos reservados.</span>
        <a href="#inicio">Volver arriba ↑</a>
      </div>
    </footer>
  )
}
