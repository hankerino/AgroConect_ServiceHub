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

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

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
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/DataSources" element={<DataSources />} />
                
                <Route path="/MarketPrices" element={<MarketPrices />} />
                
                <Route path="/Weather" element={<Weather />} />
                
                <Route path="/LearningCenter" element={<LearningCenter />} />
                
                <Route path="/Marketplace" element={<Marketplace />} />
                
                <Route path="/ProductDetail" element={<ProductDetail />} />
                
                <Route path="/ExpertDetail" element={<ExpertDetail />} />
                
                <Route path="/Community" element={<Community />} />
                
                <Route path="/Consultations" element={<Consultations />} />
                
                <Route path="/Checkout" element={<Checkout />} />

                <Route path="/checkout" element={<Checkout />} />

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