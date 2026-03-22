import GlobalNav from "./GlobalNav.jsx";

export default function Footer({ pageType = "home" }) {
  return (
    <footer>
      <div className='container footer-wrapper'>
        <p className='footer-logo font-roboto'>g-tatemichi.com</p>
        <nav className='footer-nav font-roboto'>
          <GlobalNav pageType={pageType} />
        </nav>
      </div>

      <div
        style={{
          textAlign: "center",
          color: "white",
          marginTop: 24,
          padding: 4,
        }}
      >
        <small>&copy; Genki Tatemichi. All rights reserved 2026</small>
      </div>
    </footer>
  );
}
