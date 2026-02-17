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

  const loadReviews = async () => {
    const { data } = await supabase
      .from('public_reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) setReviews(data);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Te rugăm să alegi un rating');
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

      alert('Mulțumim! Recenzia ta a fost trimisă și va fi verificată de echipa noastră înainte de publicare.');
      setName('');
      setMessage('');
      setRating(0);
      loadReviews();
    } catch (error) {
      console.error('Error:', error);
      alert('A apărut o eroare. Te rugăm să încerci din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-zinc-900">
      <div className="container mx-auto px-4 max-w-3xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Lasă o recenzie</h3>

        <form onSubmit={handleSubmit} className="bg-zinc-800 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nume (opțional)"
              className="px-4 py-2 bg-zinc-700 text-white rounded border border-zinc-600 focus:border-teal-500 focus:outline-none"
            />

            <div className="flex gap-1 items-center justify-center md:justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
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

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            placeholder="Scrie un mesaj..."
            className="w-full px-4 py-2 bg-zinc-700 text-white rounded border border-zinc-600 focus:border-teal-500 focus:outline-none mb-4 resize-none"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded font-semibold transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Se trimite...' : 'Trimite'}
          </button>
        </form>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-zinc-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-white">{review.author_name}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'}
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
      </div>
    </section>
  );
}
