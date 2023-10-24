"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import Button from "./Button";
import styles from "@/styles/Form.module.scss";

type FormData = {
  title: string;
};

interface props {
  session: string;
}

export default function NewChat({ session }: props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmitForm: SubmitHandler<FormData> = async (formData) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        router.refresh();
        successNotification("New Chat created successfully");
      }
    } catch (e) {
      errorNotification("Something went wrong");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={styles.form_wrapper}
        style={{
          width: "100%",
          maxWidth: "100%",
        }}>
        <form
          className={styles.form}
          style={{
            maxWidth: "100%",
          }}
          onSubmit={handleSubmit(handleSubmitForm)}>
          <div className={styles.inputs_container}>
            <div className={styles.input_container}>
              {/* <span className={styles.label}>Title</span> */}

              <input
                type="text"
                disabled={loading}
                className={
                  loading ? `${styles.input} ${styles.load}` : styles.input
                }
                placeholder="Title"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 2,
                    message: "Title must contain at least 2 characters",
                  },
                  maxLength: {
                    value: 25,
                    message: "Title cannot contain more than 25 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z0-9 ]*$/,
                    message: "Title is not valid",
                  },
                })}
              />

              {errors.title && (
                <span className={styles.error}>{errors.title.message}</span>
              )}
            </div>

            <Button type="submit" load={loading} disabled={!isValid}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}