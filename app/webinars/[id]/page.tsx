'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Users,
  Video,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Webinar {
  _id: string;
  title: string;
  description: string;
  host: {
    userId: string;
    name: string;
    role: string;
    avatar?: string;
  };
  scheduledDate: string;
  duration: number;
  meetLink?: string;
  maxAttendees?: number;
  category: string;
  tags: string[];
  status: string;
  attendees: { userId: string }[];
}

export default function WebinarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchWebinar();
    }
  }, [params.id]);

  const fetchWebinar = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/webinars/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setWebinar(data.webinar);
        
        // Check if user is registered
        if (user && data.webinar.attendees) {
          const registered = data.webinar.attendees.some(
            (a: any) => a.userId === (user as any).userId
          );
          setIsRegistered(registered);
        }
      }
    } catch (error) {
      console.error('Error fetching webinar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      setRegistering(true);
      const response = await fetch(`/api/webinars/${params.id}/register`, {
        method: 'POST',
      });

      if (response.ok) {
        setIsRegistered(true);
        fetchWebinar();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to register');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register for webinar');
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    try {
      setRegistering(true);
      const response = await fetch(`/api/webinars/${params.id}/register`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsRegistered(false);
        fetchWebinar();
      }
    } catch (error) {
      console.error('Error unregistering:', error);
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!webinar) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Webinar not found
          </h2>
          <Link href="/webinars" className="mt-4 text-primary-600">
            Back to webinars
          </Link>
        </div>
      </div>
    );
  }

  const isFull =
    webinar.maxAttendees && webinar.attendees.length >= webinar.maxAttendees;
  const isPast = webinar.status === 'completed';
  const isCancelled = webinar.status === 'cancelled';
  const isLive = webinar.status === 'live';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/webinars"
          className="mb-6 inline-flex items-center gap-2 text-sm text-secondary-600 hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to webinars
        </Link>

        {/* Main Card */}
        <div className="rounded-2xl border border-white/40 bg-white/60 p-8 shadow-xl backdrop-blur">
          {/* Status Badge */}
          {isLive && (
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-sm font-semibold text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white"></span>
              LIVE NOW
            </div>
          )}

          {isCancelled && (
            <div className="mb-4 inline-flex items-center rounded-full bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700">
              CANCELLED
            </div>
          )}

          {/* Title */}
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            {webinar.title}
          </h1>

          {/* Host */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-600">
              {webinar.host.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900">{webinar.host.name}</p>
              <p className="text-sm text-secondary-600">{webinar.host.role}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl bg-white/50 p-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-xs text-secondary-500">Date & Time</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(webinar.scheduledDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-xs text-secondary-500">Duration</p>
                <p className="text-sm font-medium text-gray-900">
                  {webinar.duration} minutes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-xs text-secondary-500">Attendees</p>
                <p className="text-sm font-medium text-gray-900">
                  {webinar.attendees.length}
                  {webinar.maxAttendees && ` / ${webinar.maxAttendees}`}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              About this webinar
            </h2>
            <p className="whitespace-pre-wrap text-secondary-700">
              {webinar.description}
            </p>
          </div>

          {/* Tags */}
          {webinar.tags && webinar.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-700">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {webinar.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {!isCancelled && !isPast && (
              <>
                {isRegistered ? (
                  <>
                    {(isLive && webinar.meetLink) && (
                      <a
                        href={webinar.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex items-center gap-2 px-6 py-3"
                      >
                        <Video className="h-5 w-5" />
                        Join Meeting
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={handleUnregister}
                      disabled={registering}
                      className="btn-secondary px-6 py-3"
                    >
                      {registering ? 'Processing...' : 'Unregister'}
                    </button>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        You're registered!
                      </span>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering || Boolean(isFull)}
                    className="btn-primary px-6 py-3 disabled:opacity-50"
                  >
                    {registering
                      ? 'Registering...'
                      : isFull
                      ? 'Webinar Full'
                      : 'Register Now'}
                  </button>
                )}
              </>
            )}

            {isPast && webinar.meetLink && (
              <a
                href={webinar.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2 px-6 py-3"
              >
                <Video className="h-5 w-5" />
                View Recording
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
