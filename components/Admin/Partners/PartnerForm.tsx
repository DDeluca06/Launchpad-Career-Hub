import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Stack, 
  Textarea,
  Select,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { Partner, NewPartner } from './types';
import { createPartner, updatePartner } from './partner-service';

interface PartnerFormProps {
  partner?: Partner;
  onSuccess: () => void;
  onCancel: () => void;
}

const PartnerForm: React.FC<PartnerFormProps> = ({ partner, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const isEditing = !!partner;

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<NewPartner>({
    defaultValues: partner || {
      name: '',
      description: '',
      industry: '',
      location: '',
      websiteUrl: '',
      logoUrl: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
    }
  });

  useEffect(() => {
    if (partner) {
      reset(partner);
    }
  }, [partner, reset]);

  const onSubmit: SubmitHandler<NewPartner> = async (data) => {
    setIsSubmitting(true);
    try {
      if (isEditing && partner) {
        await updatePartner(partner.id, data);
        toast({
          title: 'Partner updated',
          description: 'Partner has been successfully updated',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        await createPartner(data);
        toast({
          title: 'Partner created',
          description: 'New partner has been successfully created',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error submitting partner form:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving the partner. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={4}>
        <FormControl isInvalid={!!errors.name} isRequired>
          <FormLabel>Partner Name</FormLabel>
          <Input
            {...register('name', { 
              required: 'Partner name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description} isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            {...register('description', { 
              required: 'Description is required' 
            })}
            rows={4}
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.industry} isRequired>
          <FormLabel>Industry</FormLabel>
          <Input
            {...register('industry', { 
              required: 'Industry is required' 
            })}
          />
          <FormErrorMessage>{errors.industry?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.location} isRequired>
          <FormLabel>Location</FormLabel>
          <Input
            {...register('location', { 
              required: 'Location is required' 
            })}
          />
          <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.websiteUrl}>
          <FormLabel>Website URL</FormLabel>
          <Input
            {...register('websiteUrl', { 
              pattern: {
                value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                message: 'Please enter a valid URL'
              }
            })}
          />
          <FormErrorMessage>{errors.websiteUrl?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.logoUrl}>
          <FormLabel>Logo URL</FormLabel>
          <Input
            {...register('logoUrl', { 
              pattern: {
                value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                message: 'Please enter a valid URL'
              }
            })}
          />
          <FormErrorMessage>{errors.logoUrl?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.contactName}>
          <FormLabel>Contact Name</FormLabel>
          <Input {...register('contactName')} />
          <FormErrorMessage>{errors.contactName?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.contactEmail}>
          <FormLabel>Contact Email</FormLabel>
          <Input
            {...register('contactEmail', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
            type="email"
          />
          <FormErrorMessage>{errors.contactEmail?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.contactPhone}>
          <FormLabel>Contact Phone</FormLabel>
          <Input {...register('contactPhone')} />
          <FormErrorMessage>{errors.contactPhone?.message}</FormErrorMessage>
        </FormControl>

        <Stack direction="row" spacing={4} justifyContent="flex-end" pt={4}>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button 
            type="submit" 
            colorScheme="blue" 
            isLoading={isSubmitting}
            loadingText={isEditing ? "Updating" : "Creating"}
          >
            {isEditing ? "Update Partner" : "Create Partner"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default PartnerForm; 