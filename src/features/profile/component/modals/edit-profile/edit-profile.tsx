import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Trash, Upload } from 'lucide-react';
import 'react-phone-number-input/style.css';
import './edit-profile.css';
import PhoneInput, { isPossiblePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input';
import DummyProfile from '../../../../../assets/images/dummy_profile.png';
import { User } from '@/types/user.type';
import { ACCOUNT_QUERY_KEY, useUpdateAccount } from 'features/profile/hooks/use-account';
import { useQueryClient } from '@tanstack/react-query';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { Label } from 'components/ui/label';
import { Input } from 'components/ui/input';
import { Form, FormField, FormItem, FormControl, FormMessage } from 'components/ui/form';
import { useDropzone } from 'react-dropzone';

type FormData = {
  itemId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImageUrl: File | string;
  profileImageId: string;
};

type EditProfileProps = {
  userInfo: User;
  onClose: () => void;
};

export const EditProfile: React.FC<EditProfileProps> = ({ userInfo, onClose }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: updateAccount, isPending } = useUpdateAccount({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
      queryClient.refetchQueries({ queryKey: ACCOUNT_QUERY_KEY });
      onClose();
      navigate('/profile');
    },
  });

  const [previewImage, setPreviewImage] = useState<string>(DummyProfile);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      itemId: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      profileImageUrl: '',
    },
  });

  const { watch, setValue, handleSubmit, control } = form;
  const watchedValues = watch();

  useEffect(() => {
    if (userInfo) {
      setValue('fullName', `${userInfo.firstName ?? ''} ${userInfo.lastName ?? ''}`.trim());
      setValue('email', userInfo.email ?? '');
      setValue('phoneNumber', userInfo.phoneNumber ?? '');
      setValue('itemId', userInfo.itemId ?? '');
      setPreviewImage(userInfo.profileImageUrl || DummyProfile);
    }
  }, [userInfo, setValue]);

  useEffect(() => {
    const initialValues = {
      fullName: `${userInfo.firstName} ${userInfo.lastName}`,
      phoneNumber: userInfo.phoneNumber,
      profileImageUrl: userInfo.profileImageUrl || '',
    };

    setIsFormChanged(
      watchedValues.fullName !== initialValues.fullName ||
        watchedValues.phoneNumber !== initialValues.phoneNumber ||
        watchedValues.profileImageUrl !== initialValues.profileImageUrl
    );
  }, [watchedValues, userInfo]);

  const onSubmit = async (data: FormData) => {
    const [firstName, lastName] = data.fullName.split(' ');
    let profileImageUrl = '';

    if (typeof data.profileImageUrl === 'object') {
      const file = data.profileImageUrl as File;
      profileImageUrl = await convertFileToBase64(file);
    } else {
      profileImageUrl = data.profileImageUrl;
    }

    const payload = {
      itemId: data.itemId,
      firstName: firstName || '',
      lastName: lastName || '',
      email: data.email,
      phoneNumber: data.phoneNumber,
      profileImageUrl,
    };

    updateAccount(payload);
    onClose();
    navigate('/profile');
  };

  const handleRemoveImage = () => {
    setValue('profileImageUrl', '');
    setPreviewImage(DummyProfile);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file as Base64'));
    });
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue('profileImageUrl', file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    multiple: false,
  });

  return (
    <DialogContent className="rounded-md sm:max-w-[700px] overflow-y-auto max-h-screen">
      <DialogHeader>
        <DialogTitle>Edit profile details</DialogTitle>
        <DialogDescription>Keep your details accurate and up to date.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex items-start sm:items-center">
            <img
              src={previewImage}
              alt="Profile"
              className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] rounded-full object-cover border shadow-sm"
            />
            <div className="flex flex-col gap-2 ml-4 sm:ml-9">
              <h1 className="text-xl font-semibold">
                {userInfo.firstName} {userInfo.lastName}
              </h1>
              <p className="text-sm">*.png, *.jpeg files up to 2MB, minimum size 400x400px.</p>
              <div className="flex gap-2 sm:gap-4">
                <div {...getRootProps()} className="inline-block">
                  <Button size="sm" variant="outline" type="button">
                    <Upload className="w-4 h-4" />
                    <Label className="text-xs font-medium cursor-pointer">Upload Image</Label>
                    <input {...getInputProps()} className="hidden" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash className="w-4 h-4" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="fullName"
              rules={{ required: 'Full Name is required' }}
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2">
                  <Label>Full Name*</Label>
                  <FormControl>
                    <Input {...field} placeholder="Enter your full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="phoneNumber"
              rules={{
                validate: (value) => {
                  if (!value) return 'Phone number is required';
                  if (!isPossiblePhoneNumber(value)) return 'Phone number length is invalid';
                  if (!isValidPhoneNumber(value)) return 'Invalid phone number';
                  return true;
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <Label>Mobile No.</Label>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      onChange={(value) => setValue('phoneNumber', value ?? '')}
                      className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your mobile number"
                      defaultCountry="CH"
                      countryCallingCodeEditable={false}
                      international
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="mt-5 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending} disabled={isPending || !isFormChanged}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
