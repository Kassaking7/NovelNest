import React, { useState, useEffect } from "react"
import Link from "next/link"

function Navbar({ fd, sx }) {
  const [menu, setMenu] = useState(false)

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link href="/" className="navbar-item">
          <strong>NovelNest</strong>
        </Link>
        <button
          className={`button navbar-burger burger ${menu && "is-active"}`}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbar-main"
          onClick={() => setMenu(!menu)}
          href="#"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
      <div id="navbar-main" className={`navbar-menu ${menu && "is-active"}`}>
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <button className="button is-info" onClick={fd}>
               Font ⬆
              </button>
              <button className="button is-info" onClick={sx}>
                Font ⬇
              </button>
              <a
                className="button is-primary"
                href="https://github.com/Kassaking7/NovelNest"
              >
                Source Code
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
