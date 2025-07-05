
import React, { useState } from 'react';
import { Plus, Phone, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

const EmergencyContacts = () => {
  const { emergencyContacts, addEmergencyContact, removeEmergencyContact } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    relationship: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone_number) {
      return;
    }

    const { error } = await addEmergencyContact(formData);
    
    if (!error) {
      setFormData({ name: '', phone_number: '', relationship: '' });
      setIsOpen(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this emergency contact?')) {
      await removeEmergencyContact(id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sage-800">Emergency Contacts</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-sage-600 hover:bg-sage-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Select value={formData.relationship} onValueChange={(value) => setFormData({ ...formData, relationship: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family Member</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="colleague">Colleague</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="neighbor">Neighbor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-sage-600 hover:bg-sage-700">
                  Add Contact
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {emergencyContacts.length === 0 ? (
          <div className="text-center py-8 text-sage-600">
            <UserPlus className="h-12 w-12 mx-auto mb-4 text-sage-400" />
            <p className="text-lg font-medium mb-2">No emergency contacts yet</p>
            <p className="text-sm">Add trusted contacts who will be notified in case of emergency</p>
          </div>
        ) : (
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sage-800">{contact.name}</h4>
                  <p className="text-sm text-sage-600">{contact.phone_number}</p>
                  {contact.relationship && (
                    <p className="text-xs text-sage-500 capitalize">{contact.relationship}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="border-sage-300 text-sage-700"
                  >
                    <a href={`tel:${contact.phone_number}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemove(contact.id)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {emergencyContacts.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> These contacts will be notified immediately when you trigger an emergency alert, 
              along with your current location.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyContacts;
