'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
  return (
    <main className='min-h-screen p-24 flex flex-col items-center justify-center w-full h-screen gap-2'>
      <Button
        onClick={() => window.open('https://github.com/chrisstayte', '_blank')}>
        Github
      </Button>
      <Button
        onClick={() =>
          window.open('https://www.youtube.com/@chrisstayte', '_blank')
        }>
        Youtube
      </Button>
      <Button onClick={() => window.open('https://chrisstayte.app', '_blank')}>
        Apps
      </Button>
    </main>
  );
}
