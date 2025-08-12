import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mountain, Calendar, Users, Utensils } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Mountain className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Refugio de Montaña
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Escapa a la tranquilidad de la montaña. Reserva tu estadía en nuestro acogedor refugio 
              con vistas espectaculares y servicios de primera calidad.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link href="/booking">
                <Calendar className="w-5 h-5 mr-2" />
                Hacer Reserva
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link href="/admin">
                Panel Admin
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Units Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            Nuestras Unidades de Alojamiento
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Refugio
                </CardTitle>
                <CardDescription>35 camas individuales</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Alojamiento compartido en nuestro refugio principal con ambiente cálido y acogedor.
                </p>
                <p className="font-semibold text-lg mt-4 text-blue-600">
                  $5.000 por persona/noche
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mountain className="w-5 h-5 mr-2 text-green-600" />
                  Camping
                </CardTitle>
                <CardDescription>50 plazas disponibles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Experiencia al aire libre con acceso a instalaciones del refugio.
                </p>
                <p className="font-semibold text-lg mt-4 text-green-600">
                  $3.000 por persona/noche
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Cabaña Completa
                </CardTitle>
                <CardDescription>8 camas (2 habitaciones)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Cabaña privada completa ideal para grupos familiares o de amigos.
                </p>
                <p className="font-semibold text-lg mt-4 text-purple-600">
                  $40.000 por noche
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-orange-600" />
                  Habitación 1
                </CardTitle>
                <CardDescription>4 camas privadas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Habitación privada dentro de la cabaña principal.
                </p>
                <p className="font-semibold text-lg mt-4 text-orange-600">
                  $20.000 por noche
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-orange-600" />
                  Habitación 2
                </CardTitle>
                <CardDescription>4 camas privadas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Segunda habitación privada dentro de la cabaña principal.
                </p>
                <p className="font-semibold text-lg mt-4 text-orange-600">
                  $20.000 por noche
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Utensils className="w-5 h-5 mr-2 text-amber-600" />
                  Servicios Extra
                </CardTitle>
                <CardDescription>Desayuno y almuerzo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-slate-600">
                    <span className="font-medium">Desayuno:</span> $2.000/persona/día
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium">Almuerzo:</span> $3.000/persona/día
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para tu Aventura en la Montaña?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Reserva ahora y asegura tu lugar en el refugio
          </p>
          <Button asChild size="lg" variant="secondary" className="px-8">
            <Link href="/booking">
              Reservar Ahora
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}