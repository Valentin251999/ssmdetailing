import { useState, useEffect } from 'react';
import { Star, Quote, CheckCircle, AlertCircle, ChevronLeft, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEOHelmet from '../components/SEOHelmet';
import { BreadcrumbSchema } from '../components/SchemaMarkup';

interface PublicReview {
  id: string;
  author_name: string;
  message: string;
  rating: number;
  created_at: string;
}

function ReviewsSchemaMarkup({ reviews }: { reviews: PublicReview[] }) {
  useEffect(() => {
    if (reviews.length === 0) return;

    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://ssmdetailing.ro/#organization',
      name: 'SSM Detailing',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avg.toFixed(1),
        reviewCount: reviews.length.toString(),
        bestRating: '5',
        worstRating: '1'
      },
      review: reviews.map((review) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author_name
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5
        },
        reviewBody: review.message,
        datePublished: review.created_at.split('T')[0]
      }))
    };

    let scriptTag = document.querySelector('script[data-schema-id="reviews-page"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-schema-id', 'reviews-page');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schema);

    return () => {
      const tag = document.querySelector('script[data-schema-id="reviews-page"]');
      if (tag) tag.remove();
    };
  }, [reviews]);

  return null;
}

export default function RecenziiPage() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadReviews = async () => {
    try {
      const { data } = await supabase
        .from('public_reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (data) setReviews(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus(null);

    if (rating === 0) {
      setFormStatus({ type: 'error', text: 'Te rugam sa alegi un rating.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('public_reviews').insert([{
        author_name: name.trim() || 'Anonim',
        message,
        rating,
        is_approved: false
      }]);

      if (error) throw error;

      setFormStatus({
        type: 'success',
        text: 'Multumim! Recenzia ta a fost trimisa si va fi verificata de echipa noastra inainte de publicare.'
      });
      setName('');
      setMessage('');
      setRating(0);
    } catch {
      setFormStatus({ type: 'error', text: 'A aparut o eroare. Te rugam sa incerci din nou.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percent: reviews.length > 0
      ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100)
      : 0
  }));

  return (
    <>
      <SEOHelmet
        title="Recenzii Clienti SSM Detailing Marculesti | Pareri Detailing Auto"
        description="Citeste recenziile clientilor SSM Detailing Marculesti. Pareri reale despre servicii de detailing auto, plafoane starlight si reconditioanare faruri. Lasa si tu o recenzie!"
        keywords="recenzii SSM Detailing, pareri detailing Marculesti, recenzii detailing auto Ialomita, testimoniale detailing auto"
        canonical="https://ssmdetailing.ro/recenzii"
      />
      <BreadcrumbSchema items={[
        { name: 'Acasa', url: 'https://ssmdetailing.ro/' },
        { name: 'Recenzii', url: 'https://ssmdetailing.ro/recenzii' }
      ]} />
      <ReviewsSchemaMarkup reviews={reviews} />

      <div className="min-h-screen bg-black">
        <div className="bg-gradient-to-b from-zinc-950 to-black pt-8 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-zinc-500 hover:text-amber-400 transition-colors text-sm mb-10 group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              Inapoi la pagina principala
            </a>

            <div className="text-center mb-16">
              <span className="text-amber-500 font-medium text-sm uppercase tracking-widest">
                Pareri verificate
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 mb-5 leading-tight">
                Recenzii Clienti
              </h1>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Fiecare recenzie este verificata manual inainte de publicare. Parerea ta conteaza pentru noi si pentru viitorii clienti.
              </p>
            </div>

            {!loading && reviews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                <div className="md:col-span-1 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                  <div className="text-6xl font-bold text-white mb-2">{avgRating}</div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={22}
                        className={i < Math.round(parseFloat(avgRating))
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-700'}
                      />
                    ))}
                  </div>
                  <p className="text-zinc-400 text-sm">{reviews.length} {reviews.length === 1 ? 'recenzie' : 'recenzii'} verificate</p>
                  <div className="mt-4 flex items-center gap-2 text-amber-500">
                    <Award size={16} />
                    <span className="text-xs font-medium uppercase tracking-wide">Rating de incredere</span>
                  </div>
                </div>

                <div className="md:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8">
                  <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wide">Distributia ratingurilor</h3>
                  <div className="space-y-3">
                    {ratingCounts.map(({ star, count, percent }) => (
                      <div key={star} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16 justify-end">
                          <span className="text-zinc-400 text-sm">{star}</span>
                          <Star size={13} className="fill-amber-400 text-amber-400" />
                        </div>
                        <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-700"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-zinc-500 text-xs w-8">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Lasa o recenzie</h2>
                  <p className="text-zinc-500 text-sm">Experienta ta ne ajuta sa ne imbunatatim si ii ajuta pe ceilalti clienti.</p>
                </div>

                {formStatus && (
                  <div
                    role="alert"
                    className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
                      formStatus.type === 'success'
                        ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/50'
                        : 'bg-red-950/50 text-red-400 border border-red-800/50'
                    }`}
                  >
                    {formStatus.type === 'success'
                      ? <CheckCircle size={18} className="shrink-0 mt-0.5" />
                      : <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    }
                    <span>{formStatus.text}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-7 space-y-5">
                  <div>
                    <label htmlFor="review-name" className="block text-sm font-medium text-zinc-400 mb-2">
                      Numele tau <span className="text-zinc-600">(optional)</span>
                    </label>
                    <input
                      id="review-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Ion Popescu"
                      className="w-full px-4 py-3 bg-zinc-800 text-white rounded-xl border border-zinc-700 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-colors placeholder:text-zinc-600"
                    />
                  </div>

                  <div>
                    <span className="block text-sm font-medium text-zinc-400 mb-2">Rating</span>
                    <div className="flex gap-2" role="radiogroup" aria-label="Alege un rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          aria-label={`${star} ${star === 1 ? 'stea' : 'stele'}`}
                          aria-pressed={rating === star}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            size={30}
                            className={`${
                              star <= (hoveredRating || rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-zinc-700'
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="text-zinc-500 text-xs mt-1.5">
                        {rating === 1 && 'Nesatisfacator'}
                        {rating === 2 && 'Slab'}
                        {rating === 3 && 'Satisfacator'}
                        {rating === 4 && 'Bine'}
                        {rating === 5 && 'Excelent!'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="review-message" className="block text-sm font-medium text-zinc-400 mb-2">
                      Mesajul tau
                    </label>
                    <textarea
                      id="review-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      placeholder="Descrie experienta ta cu SSM Detailing..."
                      className="w-full px-4 py-3 bg-zinc-800 text-white rounded-xl border border-zinc-700 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-colors placeholder:text-zinc-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-amber-600/20 active:scale-[0.98]"
                  >
                    {isSubmitting ? 'Se trimite...' : 'Trimite Recenzia'}
                  </button>

                  <p className="text-xs text-zinc-600 text-center">
                    Recenziile sunt verificate manual inainte de publicare.
                  </p>
                </form>
              </div>

              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {reviews.length > 0 ? `${reviews.length} ${reviews.length === 1 ? 'Recenzie' : 'Recenzii'} Verificate` : 'Recenzii'}
                  </h2>
                  <p className="text-zinc-500 text-sm">Pareri reale de la clientii nostri.</p>
                </div>

                {loading && (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 animate-pulse">
                        <div className="flex gap-3 mb-4">
                          <div className="w-10 h-10 bg-zinc-800 rounded-full" />
                          <div className="flex-1">
                            <div className="h-3 bg-zinc-800 rounded w-24 mb-2" />
                            <div className="h-2 bg-zinc-800 rounded w-16" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2.5 bg-zinc-800 rounded w-full" />
                          <div className="h-2.5 bg-zinc-800 rounded w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && reviews.length === 0 && (
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-10 text-center">
                    <Quote size={36} className="text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-400">
                      Fii primul care lasa o recenzie!
                    </p>
                  </div>
                )}

                {!loading && reviews.length > 0 && (
                  <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-600/20 border border-amber-600/30 flex items-center justify-center text-amber-500 font-bold text-sm">
                              {review.author_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-sm">{review.author_name}</p>
                              <div className="flex items-center gap-1 mt-0.5" aria-label={`Rating: ${review.rating} din 5`}>
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={12}
                                    className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-500/70">
                            <CheckCircle size={13} />
                            <span className="text-[11px] text-zinc-500">
                              {new Date(review.created_at).toLocaleDateString('ro-RO', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <p className="text-zinc-300 text-sm leading-relaxed">{review.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
