import React from 'react';
import './Contact.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';

const Contact = () => {
    const contactInfo = { email: 'druth1020@gmail.com', emailHref: "mailto:druth1020@gmail.com"};
    return (
        <>
            <Header/>
            <div className='contactBody'>
                <div className='contactForm'>
                    <h1>Connect with Us and Let Your Voice Be Heard</h1>
                    <p>We at Escape value your thoughts, questions, and feedback. We believe in fostering strong connections and providing support to our community of passionate blog writers. If you have any inquiries or would simply like to reach out, we encourage you to get in touch with us via email. We're here to listen, assist, and collaborate.</p>
                    <h2>General Inquiries:</h2>
                    <p>For general inquiries or if you need assistance with any aspect of Escape, please reach out to us at <a href={contactInfo.emailHref}>{contactInfo.email}</a>. Our dedicated team will respond to your email as soon as possible, typically within 24 to 48 hours. We strive to provide timely and helpful responses to ensure your experience with Escape is seamless and rewarding.</p>
                    <h2>Collaborations and Partnerships:</h2>
                    <p>If you are interested in exploring collaborative opportunities or forming partnerships with Escape, we would be delighted to hear from you. Please email us at <a href={contactInfo.emailHref}>{contactInfo.email}</a>. We believe in the power of collaboration and are always open to working with like-minded individuals and organizations to create mutually beneficial endeavors.</p>
                    <h2>Technical Support:</h2>
                    <p>Should you encounter any technical issues while navigating Escape or have concerns related to the website's functionality, please don't hesitate to contact our technical support team at <a href={contactInfo.emailHref}>{contactInfo.email}</a>. We're here to assist you in resolving any technical difficulties you may encounter, ensuring that your experience on Escape remains seamless and enjoyable.</p>
                    <h2>Copyright and Content Issues:</h2>
                    <p>At Escape, we respect intellectual property rights and strive to uphold the highest standards of content integrity. If you believe that your work has been used on Escape without proper attribution or permission, or if you have any copyright-related concerns, please reach out to us at <a href={contactInfo.emailHref}>{contactInfo.email}</a>. We will promptly investigate the matter and take appropriate action in accordance with our content policies.</p>
                    <h2>Media and Press Inquiries:</h2>
                    <p>For media inquiries, press releases, or interview requests related to Escape, please contact our media relations team at <a href={contactInfo.emailHref}>{contactInfo.email}</a>. We are available to provide information, answer questions, and facilitate interviews to help share the story of Escape with a wider audience.</p>
                    <p>We eagerly await your email and look forward to connecting with you. Your voice matters, and we value the opportunity to engage in meaningful conversations with our community. Join us at Escape as we continue to celebrate the art of writing and the boundless creativity of blog writers.</p>
                    <p><br></br>Thank you for choosing Escape. Together, let's make every word count.</p>
                    <p><br/>Warm regards,<br/><br/>The Escape Team</p>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default Contact;