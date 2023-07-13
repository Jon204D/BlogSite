using Server_Escape.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
/*
 * Added MyAllowSpecificOrigins & builder.Services.AddCors - JRD
 */
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        builder =>
        {
            builder.WithOrigins("http://localhost:3000", "http://example.com")
            .AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin();
        });
});

builder.Services.AddControllers();
//Added after Services.cs and Controller.cs were built. - JRD
builder.Services.AddSingleton<IUserServices, UserServices>();
builder.Services.AddSingleton<IPostServices, PostServices>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

/*
 * CORS Setup - JRD
 */
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();