'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Henry Quinones',
    email: 'henry@agroconect.com',
    phone: '+55 11 98765-4321',
    location: 'São Paulo, Brasil',
    farm_size: '150 hectares',
    crops: 'Soja, Milho, Café'
  });

  const handleSave = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEditing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle>{profile.name}</CardTitle>
                  <CardDescription>Farmer & AgroConect User</CardDescription>
                </div>
              </div>
              {!editing && (
                <Button onClick={() => setEditing(true)} variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {editing ? (
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  ) : (
                    <p>{profile.name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {editing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  ) : (
                    <p>{profile.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {editing ? (
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  ) : (
                    <p>{profile.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {editing ? (
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                    />
                  ) : (
                    <p>{profile.location}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="farm_size">Farm Size</Label>
                {editing ? (
                  <Input
                    id="farm_size"
                    value={profile.farm_size}
                    onChange={(e) => setProfile({...profile, farm_size: e.target.value})}
                  />
                ) : (
                  <p>{profile.farm_size}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="crops">Main Crops</Label>
                {editing ? (
                  <Input
                    id="crops"
                    value={profile.crops}
                    onChange={(e) => setProfile({...profile, crops: e.target.value})}
                  />
                ) : (
                  <p>{profile.crops}</p>
                )}
              </div>
            </div>

            {editing && (
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
