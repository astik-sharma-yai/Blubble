import { User, Mail, MapPin, Calendar, BookOpen } from 'lucide-react';
import './About.css';

export const About = () => {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About Me</h1>
        <p>Get to know the person behind the blog</p>
      </div>

      <div className="about-content">
        <div className="profile-section">
          <div className="profile-image">
            <User size={80} />
          </div>
          
          <div className="profile-info">
            <h2>Your Name</h2>
            <p className="bio">
              Welcome to my personal blog! I'm passionate about sharing thoughts, ideas, and experiences 
              through writing. This space is where I explore various topics that interest me and hopefully 
              provide value to readers like you.
            </p>
            
            <div className="profile-details">
              <div className="detail-item">
                <Mail size={16} />
                <span>your.email@example.com</span>
              </div>
              <div className="detail-item">
                <MapPin size={16} />
                <span>Your Location</span>
              </div>
              <div className="detail-item">
                <Calendar size={16} />
                <span>Started blogging in 2024</span>
              </div>
              <div className="detail-item">
                <BookOpen size={16} />
                <span>Interests: Technology, Writing, Travel</span>
              </div>
            </div>
          </div>
        </div>

        <div className="about-sections">
          <section className="about-section">
            <h3>What I Write About</h3>
            <p>
              My blog covers a wide range of topics including technology, personal development, 
              travel experiences, and thoughts on various subjects that catch my interest. 
              I believe in sharing authentic perspectives and engaging in meaningful discussions 
              with readers.
            </p>
          </section>

          <section className="about-section">
            <h3>My Writing Philosophy</h3>
            <p>
              I believe that writing is a powerful tool for communication and self-expression. 
              Through my blog, I aim to share insights, experiences, and knowledge that might 
              be helpful or interesting to others. I value authenticity, clarity, and engaging 
              content that sparks conversations.
            </p>
          </section>

          <section className="about-section">
            <h3>Get in Touch</h3>
            <p>
              I love hearing from readers! Whether you have feedback, questions, or just want 
              to say hello, feel free to reach out. You can leave comments on my blog posts 
              or contact me directly through the email provided above.
            </p>
          </section>

          <section className="about-section">
            <h3>About This Blog</h3>
            <p>
              This blog is built with modern web technologies including React, Node.js, and Firebase. 
              It's designed to be simple, fast, and easy to use. The goal is to focus on content 
              rather than complex features, making it a clean and enjoyable reading experience.
            </p>
          </section>
        </div>

        <div className="stats-section">
          <h3>Blog Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Blog Posts</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Total Likes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Comments</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Tags</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 