import { useEffect, useState, type FC, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import type { GenderFieldErrors } from "../../../interfaces/GenderFieldError";
import GenderService from "../../../services/GenderService";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";

interface EditGenderFormProps { 
  onGenderUpdated: (message: string) => void;
}

const EditGenderForm: FC<EditGenderFormProps> = ({ onGenderUpdated }) => {
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState<GenderFieldErrors>({});

  const { gender_id } = useParams();

  const handleGetGender = async (genderId: string | number) => {
    try {
      setLoadingGet(true);

      const res = await GenderService.getGender(genderId);

      if (res.status === 200) {
        setGender(res.data.gender.gender);
      } else {
        console.error(
          "Unexpected status error occurred during getting gender: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpeceted server error occurred during getting gender: ",
        error
      );
    } finally {
      setLoadingGet(false);
    }
  };

  useEffect(() => {   
    if (gender_id) {
      const parsedGenderId = parseInt(gender_id);
      handleGetGender(parsedGenderId);
    } else {
      console.error(
        "Unexpeceted parameter error occurred during getting gender: ",
        gender_id
      );
    }
  }, [gender_id]);

  const handleUpdateGender = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const res = await GenderService.updateGender(gender_id!, {gender});

      if (res.status === 200) {
        setErrors({});
        setGender(res.data.gender.gender);
        onGenderUpdated(res.data.message);
      } else {
        console.error(
          "Unexpceted status error occurred during gender update: ",
          res.status
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpeceted server error occurred during gender update: ",
          error
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  // useEffect(() => {
  //   if (gender_id) {
  //     const parsedGenderId = parseInt(gender_id);
  //     handleGetGender(parsedGenderId);
  //   } else {
  //     console.error(
  //       "Unexpeceted parameter error occurred during getting gender: ",
  //       gender_id
  //     );
  //   }
  // }, [gender_id]);

  return (
    <>
      {loadingGet ? (
        <div className="flex justify-center items-center mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleUpdateGender}>
          <div className="mb-4">
            <FloatingLabelInput
              label="Gender"
              type="text"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              errors={errors.gender}
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            {!loadingUpdate && (
            <BackButton label="Back" path="/" />
            )}
            <SubmitButton
              label="Update Gender"
              loading={loadingUpdate}
              loadingLabel="Updating Gender... "
            />
          </div>
        </form>
      )}
    </>
  );
};

export default EditGenderForm;
