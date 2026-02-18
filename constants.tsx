
import React from 'react';
import { PricingPlan, PlanType } from './types';
import { Layout, Boxes, Crown } from 'lucide-react';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'plan-regular',
    name: PlanType.REGULAR,
    price: '₹3,000',
    description: 'Perfect for local small businesses looking to establish their online presence with elegance.',
    features: [
      'Clean & Modern UI',
      'Fully Responsive Design',
      'SEO Optimized Structure',
      'Contact Form Integration',
      '1 Year Hosting Support'
    ]
  },
  {
    id: 'plan-advance',
    name: PlanType.ADVANCE,
    price: '₹5,000',
    description: 'Dynamic experiences with interactive elements that captivate your local audience.',
    features: [
      '3D Website Elements',
      'Advanced Motion Design',
      'Interactive UI Transitions',
      'Content Management System',
      'Performance Optimization',
      'Google Maps Integration'
    ],
    isPopular: true
  },
  {
    id: 'plan-premium',
    name: PlanType.PREMIUM,
    price: '₹8,000',
    description: 'The pinnacle of web design. Inspired by Apple & Bugatti, built for the elite.',
    features: [
      'High-end 3D Immersive UI',
      'Luxury Visual Storytelling',
      'Ultra-Smooth Scroll Logic',
      'Premium Micro-Interactions',
      'Priority 24/7 Support',
      'Conversion-Rate Focused'
    ]
  }
];

export const FEATURES = [
  {
    title: 'Premium Design',
    description: 'Inspired by Apple’s minimal aesthetics to bring global quality to local brands.',
    icon: <Crown className="w-8 h-8" />
  },
  {
    title: 'Mobile First',
    description: 'Flawless experiences on iPhones, iPads, and every device in between.',
    icon: <Layout className="w-8 h-8" />
  },
  {
    title: 'Fast Delivery',
    description: 'Precision engineering delivered with speed. From vision to launch in days.',
    icon: <Boxes className="w-8 h-8" />
  }
];
