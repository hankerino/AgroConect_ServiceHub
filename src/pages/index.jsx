import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Profile from "./Profile";

import DataSources from "./DataSources";

import MarketPrices from "./MarketPrices";

import Weather from "./Weather";

import LearningCenter from "./LearningCenter";

import Marketplace from "./Marketplace";

import ProductDetail from "./ProductDetail";

import ExpertDetail from "./ExpertDetail";

import Community from "./Community";

import Consultations from "./Consultations";

import Checkout from "./Checkout";

import checkout from "./checkout";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import ProtectedRoute from '../../ProtectedRoute.jsx'
import Login from "./Login.jsx";

const PAGES = {
    
    Dashboard: Dashboard,
    
    Profile: Profile,
    
    DataSources: DataSources,
    
    MarketPrices: MarketPrices,
    
    Weather: Weather,
    
    LearningCenter: LearningCenter,
    
    Marketplace: Marketplace,
    
    ProductDetail: ProductDetail,
    
    ExpertDetail: ExpertDetail,
    
    Community: Community,
    
    Consultations: Consultations,
    
    Checkout: Checkout,
    
    checkout: checkout,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);

    const isAuthPage = location.pathname === "/login";

    return isAuthPage ? (
        <Routes>
            <Route path="/login" element={<Login />} />
        </Routes>
    ) : (
        <Layout currentPageName={currentPage}>
            <Routes>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/DataSources" element={<ProtectedRoute><DataSources /></ProtectedRoute>} />
                <Route path="/MarketPrices" element={<ProtectedRoute><MarketPrices /></ProtectedRoute>} />
                <Route path="/Weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
                <Route path="/LearningCenter" element={<ProtectedRoute><LearningCenter /></ProtectedRoute>} />
                <Route path="/Marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                <Route path="/ProductDetail" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
                <Route path="/ExpertDetail" element={<ProtectedRoute><ExpertDetail /></ProtectedRoute>} />
                <Route path="/Community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                <Route path="/Consultations" element={<ProtectedRoute><Consultations /></ProtectedRoute>} />
                <Route path="/Checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            </Routes>
        </Layout>

    );
}


export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
