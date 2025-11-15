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

    const { data: marketData, error: marketError } = await supabase
      .from('market_prices')
      .insert(marketPrices)
      .select();

    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .insert(products)
      .select();

    console.log('[v0] Seeding complete:', {
      marketPrices: marketData?.length || 0,
      products: productsData?.length || 0,
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
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
