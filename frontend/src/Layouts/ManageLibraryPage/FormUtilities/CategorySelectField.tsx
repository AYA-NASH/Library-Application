import { Control, Controller, FieldErrors } from "react-hook-form";
import { CategoryReference } from "../../../models/CategoryModel";
import Select from "react-select";

interface CategorySelectFieldProps {
    control: Control<any>;
    options: CategoryReference[] | undefined;
    errors: FieldErrors<any>;
}

export const CategorySelectField: React.FC<CategorySelectFieldProps> = ({ control, options, errors }) => {
    return (
        <div className="mb-3">
            <label className="form-label fw-semibold text-muted small">Categories</label>
            <Controller
                name="categoryIds"
                control={control}
                rules={{ required: "Select at least one category" }}
                render={({ field: { onChange, value, ref } }) => (
                    <Select
                        ref={ref}
                        isMulti
                        options={options ?? []}
                        value={(options ?? []).filter(opt => (value || []).includes(opt.id))}
                        onChange={(val) => {
                            onChange(val ? val.map(c => c.id) : []);
                        }}
                        getOptionLabel={(option: CategoryReference) => option.name}
                        getOptionValue={(option: CategoryReference) => option.id.toString()}
                        placeholder="Search categories..."
                        classNamePrefix="react-select"
                        className={errors.categoryIds ? 'is-invalid' : ''}
                        isLoading={!options}
                    />
                )}
            />
            {errors.categoryIds && (
                <small className="text-danger mt-1 d-block">
                    {errors.categoryIds.message as string}
                </small>
            )}
        </div>
    );
}