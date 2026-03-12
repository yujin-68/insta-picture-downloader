import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
    }

    if (!url.includes('instagram.com/')) {
      return NextResponse.json({ error: 'Please enter a valid Instagram URL' }, { status: 400 });
    }

    /* 
      ===============================================================
      TODO: 실제 Instagram Scraping API (예: RapidAPI) 연동 부분
      ===============================================================
      이곳에 RapidAPI나 다른 서비스의 엔드포인트를 호출하는 코드를 작성하세요.
      
      예시 코드:
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
        }
      };
      
      const response = await fetch(`https://api.url.here?url=${encodeURIComponent(url)}`, options);
      const data = await response.json();
      const images = data.images.map(img => img.url);
      return NextResponse.json({ success: true, count: images.length, images });
      ===============================================================
    */

    // 아래는 UI 확인을 위한 임의(Mock) 데이터 반환 로직입니다.
    // 사용자가 입력한 URL의 해시값에 따라 임의의 개수(1~5개)의 고화질 이미지를 반환합니다.
    
    // 타겟 지연 효과 (성능과 로딩 UI 확인용)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 단순 무작위 이미지 배열
    const mockImages = [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1080&q=80",
      "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=1080&q=80",
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=1080&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1080&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1080&q=80",
    ];
    
    // URL 기반으로 일관된 개수 반환(캐러셀 느낌)
    const urlLengthHash = url.length % 5;
    const count = urlLengthHash === 0 ? 1 : urlLengthHash + 1;
    
    const results = mockImages.slice(0, count);

    return NextResponse.json({
      success: true,
      count: results.length,
      images: results
    });
    
  } catch (error: any) {
    console.error('Extraction Error:', error);
    return NextResponse.json({ 
      error: 'Failed to extract images from the provided URL.',
      details: error.message
    }, { status: 500 });
  }
}
