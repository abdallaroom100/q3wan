
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebookF, faInstagram, faYoutube,faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import './Footer.css'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img className='bg-white ' style={{filter:"none",margin:"0 0"}} src="/img/logo.webp" loading='lazy' alt="شعار الجمعية" />
          <p className='!px-1 md:!pr-[1rem]'> مبرة القعوان الخيرية<br />عطاء يستمر</p>
          <p className='!px-1 md:!pr-[1rem] max-w-[400px]'>
          ترخيص صادر من الهيئة العامة للأوقاف برقم 1157 بتاريخ ١١ - ٣ - ١٤٤٥ هـ وهي خاضعة للشروط والأحكام المبينة في صك الوقفية رقم  ٣٨٤٣١٧٣٠ الذي تم إصداره بتاريخ ٢٩ - ٧ - ١٤٣٨ هـ
          </p>
        </div>

        <div className="footer-links">
          <h4>روابط سريعة</h4>
          <ul className=''>
            <li><a href="/">الرئيسية</a></li>
           
            
       
                <li><Link to="/about">معلومات عنا</Link></li>
                <li><Link to="/goals">أهدافنا</Link></li>
             
         
              <li><a href="/says">قالو عنا</a></li>
              <li><a href="/album">معرض الصور</a></li>
          </ul>
        </div>

        <div className="footer-social w-fit">
          <h4>تابعنا</h4>
          <div className="social-icons">
            <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
            <a href="#"><FontAwesomeIcon icon={faWhatsapp} /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 مبرة القعوان الخيرية - جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  )
}

export default Footer