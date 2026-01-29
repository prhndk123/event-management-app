import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Shield, Ticket, TrendingUp, Users, Zap } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { EventCard } from '~/components/events/event-card';
import { useEventStore } from '~/store/event-store';

export default function LandingPage() {
  const events = useEventStore((state) => state.events);
  const featuredEvents = events.filter(e => e.status === 'published').slice(0, 6);

  const features = [
    {
      icon: Calendar,
      title: 'Easy Event Discovery',
      description: 'Find events that match your interests with smart filters and personalized recommendations.',
    },
    {
      icon: Ticket,
      title: 'Seamless Ticketing',
      description: 'Purchase tickets in seconds with secure payment and instant delivery to your email.',
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Your payments are protected with bank-level security and fraud prevention.',
    },
    {
      icon: TrendingUp,
      title: 'Powerful Analytics',
      description: 'Organizers get real-time insights to grow their events and engage audiences.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Events Hosted' },
    { value: '500K+', label: 'Tickets Sold' },
    { value: '50K+', label: 'Happy Customers' },
    { value: '1000+', label: 'Organizers' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-accent/20 py-20 lg:py-32">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                Indonesia's #1 Event Platform
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
                Discover Events That{' '}
                <span className="text-gradient">Inspire You</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                From music festivals to tech conferences, find your next unforgettable experience. 
                Join thousands of event-goers and create memories that last.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="btn-gradient text-lg px-8" asChild>
                  <Link to="/events">
                    Explore Events
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                  <Link to="/register?role=organizer">
                    Become an Organizer
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop"
                  alt="Event"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">50K+</p>
                      <p className="text-sm text-muted-foreground">Happy Customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-40 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-foreground text-background">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-background/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 bg-background">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Upcoming Events</h2>
              <p className="text-muted-foreground">Don't miss out on these amazing experiences</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/events">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Eventku?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make discovering and organizing events simple, secure, and enjoyable for everyone.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-primary to-primary/80">
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Create Your Event?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join thousands of organizers who trust Eventku to manage their events. 
              Start selling tickets in minutes.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8"
              asChild
            >
              <Link to="/register?role=organizer">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
