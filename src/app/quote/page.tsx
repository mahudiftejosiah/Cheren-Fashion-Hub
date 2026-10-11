import { Suspense } from 'react';
import QuoteForm from './QuoteForm';

export const metadata = {
  title: 'Request a Custom Quote',
  description: 'Submit a custom outfit quote request to Cheren Fashion Studio.',
};

export default function QuotePage() {
  return (
    <Suspense fallback={
      <div className="py-12 max-w-4xl mx-auto px-4 text-center text-zinc-400">
        Loading quote form...
      </div>
    }>
      <QuoteForm />
    </Suspense>
  );
}
