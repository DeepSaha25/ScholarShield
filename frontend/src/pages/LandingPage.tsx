import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, LockKeyhole, Zap, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="badge-pill">Powered by Midnight Network</div>
          <h1 className="hero-title">
            Verify Eligibility with <span className="text-accent">Zero-Knowledge</span>
          </h1>
          <p className="hero-subtitle">
            Prove your scholarship qualifications without revealing your actual GPA or Family Income. True privacy, fully on-chain.
          </p>
          <div className="hero-actions">
            <Link to="/verify" className="btn btn-primary btn-lg">
              Start Verification <ChevronRight size={20} />
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              How it works
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="feature-icon"><LockKeyhole size={32} /></div>
            <h3>Absolute Privacy</h3>
            <p>Your data stays on your device. Only a cryptographic proof is sent to the network.</p>
          </motion.div>
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="feature-icon"><ShieldCheck size={32} /></div>
            <h3>On-Chain Verification</h3>
            <p>The Midnight blockchain verifies the ZK proof transparently and immutably.</p>
          </motion.div>
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="feature-icon"><Zap size={32} /></div>
            <h3>Instant Decisions</h3>
            <p>Get an immediate, verifiable decision on your scholarship application.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
