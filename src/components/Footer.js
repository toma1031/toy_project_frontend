const Footer = (props) => {
  return (
    // Bootstrap 4で固定フッターを実現する方法もとても簡単で、フッター要素に対しclassを一つ指定して上げるだけです。
    // class="fixed-bottom"を追加してあげるだけです。
      <div className="page-footer font-small bg-success footer-font fixed-bottom">
        <div className="footer-copyright text-center py-3">© Retro Toys</div>
      </div>
  );
}

export default Footer;