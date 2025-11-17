import { NextResponse } from 'next/server';
import { supabase } from '@/src/api/supabaseClient.js';

export async function POST() {
  try {
    console.log('[v0] Starting database seeding...');
    
    // Sample market prices
    const marketPrices = [
      { product: 'Soja', price: 150.50, location: 'Varginha, MG', date: new Date().toISOString() },
      { product: 'Milho', price: 85.00, location: 'Rondonópolis, MT', date: new Date().toISOString() },
      { product: 'Café', price: 1250.00, location: 'Patrocínio, MG', date: new Date().toISOString() },
      { product: 'Trigo', price: 95.75, location: 'Passo Fundo, RS', date: new Date().toISOString() },
      { product: 'Arroz', price: 120.00, location: 'Pelotas, RS', date: new Date().toISOString() },
    ];

    // Sample products
    const products = [
      { name: 'Fertilizante NPK 20-05-20', price: 2500.00, description: 'Fertilizante completo para diversas culturas', category: 'Fertilizantes', stock: 150 },
      { name: 'Herbicida Glifosato', price: 85.00, description: 'Herbicida sistêmico não seletivo', category: 'Defensivos', stock: 200 },
      { name: 'Sementes de Soja', price: 450.00, description: 'Sementes de soja de alta produtividade', category: 'Sementes', stock: 500 },
    ];

    let marketData, marketError;
    
    // Try lowercase first
    const marketResult1 = await supabase.from('market_prices').insert(marketPrices).select();
    
    if (marketResult1.error?.code === '42P01') {
      // Table doesn't exist, try PascalCase
      console.log('[v0] Trying PascalCase table: MarketPrice');
      const marketResult2 = await supabase.from('MarketPrice').insert(marketPrices).select();
      marketData = marketResult2.data;
      marketError = marketResult2.error;
    } else {
      marketData = marketResult1.data;
      marketError = marketResult1.error;
    }

    // Try products table
    let productsData, productsError;
    
    const productsResult1 = await supabase.from('products').insert(products).select();
    
    if (productsResult1.error?.code === '42P01') {
      console.log('[v0] Trying PascalCase table: Product');
      const productsResult2 = await supabase.from('Product').insert(products).select();
      productsData = productsResult2.data;
      productsError = productsResult2.error;
    } else {
      productsData = productsResult1.data;
      productsError = productsResult1.error;
    }

    console.log('[v0] Seeding complete:', {
      marketPrices: marketData?.length || 0,
      products: productsData?.length || 0,
      marketError: marketError?.message,
      productsError: productsError?.message,
    });

    return NextResponse.json({
      success: true,
      seeded: {
        marketPrices: marketData?.length || 0,
        products: productsData?.length || 0,
      },
      errors: {
        market: marketError?.message || null,
        products: productsError?.message || null,
      }
    });
  } catch (error) {
    console.error('[v0] Seeding error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error instanceof Error ? error.message : 'Unknown error' : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}

export const dynamic = 'force-dynamic';
