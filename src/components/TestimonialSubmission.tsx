import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Review {
  id: string;
  author_name: string;
  message: string;
  rating: number;
  created_at: string;
}

export default function TestimonialSubmission() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('public_reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      if (data) setReviews(data);
    } catch {
      // Recenziile nu sunt critice, nu afisam eroare
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus(null);

    if (rating === 0) {
      setFormStatus({ type: 'error', text: 'Te rugam sa alegi un rating.' });
      return;
    }

    setIsSubmitting(true);

    try {
      await supabase.from('public_reviews').insert([{
        author_name: name.trim() || 'Anonim',
        message,
        rating,
        is_approved: false
      }]);

      setFormStatus({ type: 'success', text: 'Multumim! Recenzia ta a fost trimisa si va fi verificata de echipa noastra inainte de publicare.' });
      setName('');
      setMessage('');
      setRating(0);
      loadReviews();
    } catch {
      setFormStatus({ type: 'error', text: 'A aparut o eroare. Te rugam sa incerci din nou.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-zinc-900">
      <div className="container mx-auto px-4 max-w-3xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Lasă o recenzie</h3>

        {formStatus && (
          <div
            role="alert"
            className={`mb-6 p-4 rounded-lg text-sm font-medium ${
              formStatus.type === 'success'
                ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                : 'bg-red-600/20 text-red-400 border border-red-600/30'
            }`}
          >
            {formStatus.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-zinc-800 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="review-name" className="block text-sm font-medium text-zinc-400 mb-1.5">
                Nume (optional)
              </label>
              <input
                id="review-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Numele tau"
                className="w-full px-4 py-2 bg-zinc-700 text-white rounded border border-zinc-600 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-zinc-400 mb-1.5">Rating</span>
              <div className="flex gap-1 items-center" role="radiogroup" aria-label="Alege un rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    aria-label={`${star} ${star === 1 ? 'stea' : 'stele'}`}
                    aria-pressed={rating === star}
                    className="p-0.5"
                  >
                    <Star
                      size={24}
                      className={`${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-zinc-600'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="review-message" className="block text-sm font-medium text-zinc-400 mb-1.5">
              Mesajul tau
            </label>
            <textarea
              id="review-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={3}
              placeholder="Scrie experienta ta..."
              className="w-full px-4 py-2 bg-zinc-700 text-white rounded border border-zinc-600 focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded font-semibold transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Se trimite...' : 'Trimite Recenzia'}
          </button>
        </form>

        {reviews.length > 0 && (
          <div className="space-y-4" aria-label="Recenzii aprobate">
            {reviews.map((review) => (
              <div key={review.id} className="bg-zinc-800 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-white">{review.author_name}</p>
                    <div className="flex gap-1 mt-1" aria-label={`Rating: ${review.rating} din 5`}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {new Date(review.created_at).toLocaleDateString('ro-RO')}
                  </span>
                </div>
                <p className="text-zinc-300 text-sm">{review.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
