import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Trash, Upload } from 'lucide-react';
import 'react-phone-number-input/style.css';
import './edit-profile.css';
import PhoneInput from 'react-phone-number-input';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { Label } from 'components/ui/label';
import { Input } from 'components/ui/input';
import DummyProfile from '../../../../../assets/images/dummy_profile.png';
import { User } from '@/types/user.type';
import { ACCOUNT_QUERY_KEY, useUpdateAccount } from 'features/profile/hooks/use-account';
import { useQueryClient } from '@tanstack/react-query';

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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
      await queryClient.refetchQueries({ queryKey: ACCOUNT_QUERY_KEY });
      onClose();
      navigate('/profile');
    },
  });
  const [previewImage, setPreviewImage] = useState<string | null>(DummyProfile);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      itemId: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      profileImageUrl: '',
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (userInfo) {
      setValue('fullName', `${userInfo.firstName} ${userInfo.lastName}` || '');
      setValue('email', userInfo.email || '');
      setValue('phoneNumber', userInfo.phoneNumber || '');
      setValue('itemId', userInfo.itemId || '');
      setPreviewImage(userInfo.profileImageUrl || DummyProfile);
    }
  }, [userInfo, setValue]);

  useEffect(() => {
    const initialValues = {
      fullName: `${userInfo.firstName} ${userInfo.lastName}` || '',
      email: userInfo.email || '',
      phoneNumber: userInfo.phoneNumber || '',
      profileImageUrl: userInfo.profileImageUrl || '',
    };

    const hasChanged =
      watchedValues.fullName !== initialValues.fullName ||
      watchedValues.phoneNumber !== initialValues.phoneNumber ||
      watchedValues.profileImageUrl !== initialValues.profileImageUrl;

    setIsFormChanged(hasChanged);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('profileImageUrl', file);
      setPreviewImage(URL.createObjectURL(file));
    }
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
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <DialogContent className="rounded-md sm:max-w-[700px] overflow-y-auto max-h-screen">
      <DialogHeader>
        <DialogTitle>Edit profile details</DialogTitle>
        <DialogDescription>Keep your details accurate and up to date.</DialogDescription>
      </DialogHeader>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center">
          <img
            src={previewImage || DummyProfile}
            alt="Profile"
            className="w-[100px] h-[100px] rounded-full object-cover border shadow-sm"
          />
          <div className="flex flex-col gap-2 ml-4 sm:ml-9">
            <h1 className="text-xl font-semibold">
              {userInfo.firstName} {userInfo.lastName}
            </h1>
            <p className="text-sm">*.png, *.jpeg files up to 2MB, minimum size 400x400px.</p>
            <div className="flex gap-4">
              <Button size="sm" variant="outline" type="button">
                <Upload className="w-4 h-4" />
                <Label className="text-xs font-medium">
                  Upload Image
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden cursor-pointer"
                    onChange={handleImageUpload}
                  />
                </Label>
              </Button>
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
          <div className="col-span-1 sm:col-span-2">
            <Label htmlFor="full-name">Full Name*</Label>
            <Controller
              name="fullName"
              control={control}
              rules={{ required: 'Full Name is required' }}
              render={({ field }) => (
                <Input {...field} id="full-name" placeholder="Enter your full name" />
              )}
            />
            {errors.fullName && <span>{errors.fullName.message}</span>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input {...field} id="email" disabled placeholder="Enter your email" />
              )}
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Mobile No.</Label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  placeholder="Enter your mobile number"
                  defaultCountry="CH"
                  international
                  countryCallingCodeEditable={false}
                  className="PhoneInput mt-1 flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              )}
            />
            {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}
          </div>
        </div>
        <DialogFooter className="mt-5 flex justify-end gap-2">
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button type="submit" loading={isPending} disabled={isPending || !isFormChanged}>
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
